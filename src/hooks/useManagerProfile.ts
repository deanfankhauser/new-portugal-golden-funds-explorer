import { useState, useEffect } from 'react';
import { getAllApprovedManagers, PublicManagerData } from '../data/services/managers-service';

// Module-level cache to prevent N simultaneous database calls
const managersCache: { 
  data: PublicManagerData[] | null; 
  timestamp: number;
  promise: Promise<PublicManagerData[]> | null;
} = {
  data: null,
  timestamp: 0,
  promise: null
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useManagerProfile = (managerName: string): PublicManagerData | null => {
  const [profile, setProfile] = useState<PublicManagerData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check cache first
        const now = Date.now();
        let managers: PublicManagerData[];
        
        if (managersCache.data && (now - managersCache.timestamp) < CACHE_TTL) {
          // Use cached data
          managers = managersCache.data;
          console.log('✅ Using cached managers data');
        } else if (managersCache.promise) {
          // Reuse in-flight request
          console.log('⏳ Reusing in-flight managers request');
          managers = await managersCache.promise;
        } else {
          // Fetch fresh data
          console.log('🔄 Fetching fresh managers data');
          managersCache.promise = getAllApprovedManagers();
          managers = await managersCache.promise;
          managersCache.data = managers;
          managersCache.timestamp = now;
          managersCache.promise = null;
        }
        
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
