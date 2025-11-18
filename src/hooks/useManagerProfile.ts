import { useState, useEffect } from 'react';
import { getAllApprovedManagers, PublicManagerData } from '../data/services/managers-service';

export const useManagerProfile = (managerName: string): PublicManagerData | null => {
  const [profile, setProfile] = useState<PublicManagerData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const managers = await getAllApprovedManagers();
        
        console.log('🔍 Manager Profile Search:', {
          searchingFor: managerName,
          totalManagers: managers.length,
          managersList: managers.map(m => ({
            company: m.company_name,
            manager: m.manager_name,
            hasLogo: !!m.logo_url
          }))
        });
        
        // Normalize company name for matching
        const normalizeCompanyName = (name: string) => {
          return name
            .toLowerCase()
            .replace(/[,\.]/g, '')
            .replace(/\b(s\.?a\.?|llc|ltd|limited|inc|incorporated|scr|sgps|sgoic)\b/gi, '')
            .trim();
        };

        const normalizedManagerName = normalizeCompanyName(managerName);
        
        console.log('🔍 Normalized search term:', normalizedManagerName);
        
        const matchingProfile = managers.find(m => {
          const normalizedCompany = normalizeCompanyName(m.company_name);
          const normalizedManager = normalizeCompanyName(m.manager_name || '');
          const matches = normalizedCompany === normalizedManagerName || normalizedManager === normalizedManagerName;
          
          if (matches) {
            console.log('✅ Match found!', { 
              original: managerName,
              matched: m.company_name,
              hasLogo: !!m.logo_url,
              logoUrl: m.logo_url
            });
          }
          
          return matches;
        });
        
        if (!matchingProfile) {
          console.warn('❌ No matching profile found for:', managerName);
        }
        
        setProfile(matchingProfile || null);
      } catch (error) {
        console.error('❌ Error fetching manager profile:', error);
        setProfile(null);
      }
    };

    if (managerName) {
      fetchProfile();
    }
  }, [managerName]);

  return profile;
};
