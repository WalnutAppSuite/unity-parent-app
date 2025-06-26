import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import profile from '../../../public/images/profile.png';

export default function ProfileWrapper({
  isLoading = true,
  children = <></>,
  name = 'AB12',
  classSection = '10-B',
  image = profile,
  student_name = 'Adarsh Tiwari',
  reference_number = 'GD14',
  first_name = 'Adarsh',
  last_name = 'Tiwari',
  custom_division = '10-B',
  program_name = "10"
}: {
  isLoading?: boolean;
  name : string;
  classSection?: string;
  children?: React.ReactNode;
  student_name?: string;
  image?: string;
  reference_number?: string;
  first_name?: string;
  last_name?: string;
  custom_division?: string;
  program_name?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Use IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    const currentElement = document.getElementById('profile-wrapper');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  // Decide whether to show skeleton or content
  const showSkeleton = isLoading || !isVisible;

  return (
    <div id="profile-wrapper">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="tw-pt-12"
      >
        <Card className="!tw-bg-blue-500 !tw-rounded-3xl tw-relative tw-pb-8 tw-pt-16 tw-px-5 tw-flex tw-flex-col tw-items-center tw-shadow-xl tw-overflow-visible">
          {/* Profile Image with Lazy Loading */}
          <div className="tw-absolute tw--top-10 tw-left-1/2 tw--translate-x-1/2 tw-z-10">
            {showSkeleton ? (
              <div className="tw-w-24 tw-h-24 tw-bg-white/50 tw-rounded-3xl tw-shadow-lg tw-border-[3px] tw-border-white tw-overflow-hidden">
                <Skeleton className="tw-w-full tw-h-full" />
              </div>
            ) : (
              <>
                {!image ? (
                  <div className="tw-flex tw-items-center tw-justify-center tw-w-24 tw-h-24 tw-bg-white tw-text-3xl tw-rounded-3xl tw-shadow-lg tw-border-[3px] tw-border-white">
                    {`${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}`.toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={image}
                    alt={student_name}
                    className="tw-w-24 tw-h-24 tw-object-cover tw-rounded-3xl tw-shadow-lg tw-border-[3px] tw-border-white"
                    loading="lazy"
                  />
                )}
              </>
            )}
          </div>

          {/* Name and Badges */}
          <div className="tw-text-center">
            {showSkeleton ? (
              <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
                <Skeleton className="tw-w-40 tw-h-8 tw-rounded-lg tw-bg-white/30" />
                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-mb-4">
                  <Skeleton className="tw-w-16 tw-h-6 tw-rounded-full tw-bg-white/30" />
                  <Skeleton className="tw-w-16 tw-h-6 tw-rounded-full tw-bg-white/30" />
                </div>
                <Skeleton className="tw-w-full tw-h-32 tw-rounded-lg tw-bg-white/20" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="tw-text-white tw-font-medium tw-text-2xl tw-mb-2">{student_name}</h2>

                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-mb-4">
                  <Badge className="tw-bg-white/80 !tw-text-blue-500 !tw-rounded-full tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-shadow-none">
                    {program_name}-{custom_division}
                  </Badge>
                  <Badge className="tw-bg-white/80 !tw-text-blue-500 !tw-rounded-full tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-shadow-none">
                    {reference_number}
                  </Badge>
                </div>

                <div>{children}</div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
