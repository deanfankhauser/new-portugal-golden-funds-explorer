import { useState, useEffect } from 'react';
import { getAllApprovedManagers, PublicManagerData } from '../data/services/managers-service';

export const useManagerProfile = (managerName: string): PublicManagerData | null => {
  const [profile, setProfile] = useState<PublicManagerData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const managers = await getAllApprovedManagers();
      
      // Normalize company name for matching
      const normalizeCompanyName = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[,\.]/g, '')
          .replace(/\b(s\.?a\.?|llc|ltd|limited|inc|incorporated|scr|sgps|sgoic)\b/gi, '')
          .trim();
      };

      const normalizedManagerName = normalizeCompanyName(managerName);
      
      const matchingProfile = managers.find(m => 
        normalizeCompanyName(m.company_name) === normalizedManagerName ||
        normalizeCompanyName(m.manager_name || '') === normalizedManagerName
      );
      
      setProfile(matchingProfile || null);
    };

    if (managerName) {
      fetchProfile();
    }
  }, [managerName]);

  return profile;
};
