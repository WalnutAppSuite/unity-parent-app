import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Student } from "@/types/students";

interface StudentAccordionProps {
  student: Student;
  index: number;
}

function StudentAccordion({ student, index }: StudentAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate2 = (dateString: string ) => {
  if (!dateString) return '';  
  
  const date = new Date(dateString); 
  
  const day = String(date.getDate()).padStart(2, '0');      
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();                        
  
  return `${day}-${month}-${year}`;  
};

  const cardStyle = {
    background: `linear-gradient(135deg, ${getGradientColors(index)})`,
    borderRadius: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    margin: '16px',
    marginTop: '60px', 
    overflow: 'visible',
    color: 'white',
    position: 'relative' as const
  };
  
  const profileContainerStyle = {
    padding: '24px',
    paddingTop: '60px',
    textAlign: 'center' as const,
    position: 'relative' as const
  };
  
 const avatarStyle = {
  width: '120px',          
  height: '120px',       
  backgroundColor: 'white',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  position: 'absolute' as const,
  top: '-60px',            
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  border: '3px solid white',
};
  
  function getGradientColors(index: number) {
    const colors = [
      '#9333ea, #7c3aed, #6b21a8', // purple
      '#059669, #047857, #065f46', // emerald  
      '#2563eb, #1d4ed8, #1e40af', // blue
      '#ec4899, #db2777, #be185d', // pink
      '#ea580c, #dc2626, #c2410c', // orange
      '#4f46e5, #4338ca, #3730a3', // indigo
    ];
    return colors[index % colors.length];
  }
  
  return (
    <motion.div initial={false} style={{ marginBottom: '16px', position: 'relative' }}>
      
      <div style={cardStyle}>
       
        <div style={avatarStyle}>
          {student.image ? (
            <img 
              src={student.image} 
              alt={student.first_name}
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '12px', 
                objectFit: 'cover',
                
              }}
            />
          ) : (
            <svg style={{ width: '50px', height: '50px', color: '#9ca3af' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
        </div>
        
        <div style={profileContainerStyle}>
          {/* Student Name */}
           <h2 style={{ 
             fontSize: '25px', 
             fontWeight: 'bold', 
             marginBottom: '12px', 
             fontFamily: "Montserrat"  
            }}>
            {student.first_name}
          </h2>
          
          {/* Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
            
            }}>
              {student.program_name} - {student.custom_division}
            </span>
            
            {student.reference_number && (
              <span style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {student.reference_number}
              </span>
            )}
          </div>
          
          {/* Class Section */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>Class</div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '8px 16px',
              textAlign: 'left',
              border:"1px solid white"
            }}>
              <span style={{ fontWeight: '500' }}>{student.program_name?student.program_name:'-'}</span>
            </div>
          </div>
          
          {/* School Section */}
          
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>School</div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '8px 16px',
                textAlign: 'left',
                 border:"1px solid white"
              }}>
                <span style={{ fontWeight: '500', fontSize: '14px' }}>{student.school?student.school:'-'}</span>
              </div>
            </div>
          
          
          {/* Expand Button - moves based on expansion state */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: '16px' }}>
                 
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px', marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Mother Name
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                        <span style={{ fontWeight: '500' }}>
                         {(student.custom_mothers_first_name || student.custom_mothers_middle_name) 
                          ? `${student.custom_mothers_first_name || ''} ${student.custom_mothers_middle_name || ''}`.trim()
                          : '-'
                           }
                        </span>
                        </div>
                      </div>
                    
                    
                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Father Name
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                          border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>
                          {(student.custom_fathers_middle_name || student.custom_fathers_last_name) 
                            ? `${student.custom_fathers_middle_name || ''} ${student.custom_fathers_last_name || ''}`.trim()
                          : '-'
                          }
                        </span>
                        </div>
                      </div>
                    
                    
                    
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Date of Birth
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                          border:"1px solid white"
                        }}>
                        <span style={{ fontWeight: '500' }}>
                         {student.date_of_birth ? formatDate2(student.date_of_birth) : '-'}
                        </span>
                        </div>
                      </div>
                    

                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                         Religion
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                          border:"1px solid white"
                        }}>
                         <span style={{ fontWeight: '500' }}>
                           {student.religion ? student.religion : '-'}
                         </span>
                        </div>
                      </div>
                    


                     
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                         Caste
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.caste ? student.caste:'-'}</span>
                        </div>
                      </div>
                    




                     
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Sub Caste
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.sub_caste?student.sub_caste:'-'}</span>
                        </div>
                      </div>
                    


                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                         Mother Tongue
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.mother_tongue?student.mother_tongue:'-'}</span>
                        </div>
                      </div>
                    



                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Mother Mobile
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.custom_mothers_mobile_no?student.custom_mothers_mobile_no:'-'}</span>
                        </div>
                      </div>
                    

                     
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Father Email
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.custom_fathers_email?student.custom_fathers_email:'-'}</span>
                        </div>
                      </div>
                    


                     
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Father Mobile
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.custom_fathers_mobile?student.custom_fathers_mobile :'-'}</span>
                        </div>
                      </div>
                  

                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Address
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.address_line_1?student.address_line_1 :'-'}</span>
                        </div>
                      </div>
                    
                     
                    
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Address 2
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.address_line_2?student.address_line_2:'-'}</span>
                        </div>
                      </div>
                    



                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                         Blood Group
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.blood_group?student.blood_group:'-'}</span>
                        </div>
                      </div>
                    



                   
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                         Approximate yearly income of Father
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.custom_fathers_annual_income?student.custom_fathers_annual_income:'-'}</span>
                        </div>
                      </div>
                    


                 
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px',  marginBottom: '4px', textAlign: 'left', marginLeft: '12px' }}>
                          Approximate yearly income of Mother
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          textAlign: 'left',
                           border:"1px solid white"
                        }}>
                          <span style={{ fontWeight: '500' }}>{student.custom_mothers_annual_income?student.custom_mothers_annual_income:'-'}</span>
                        </div>
                      </div>
                    


                    
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <svg 
              style={{
                width: '20px',
                height: '20px',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default StudentAccordion;