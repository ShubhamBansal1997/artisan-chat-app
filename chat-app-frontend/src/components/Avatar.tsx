import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  return (
    <div className='w-10 h-10 rounded-full overflow-hidden'>
      <img src={src} alt={alt} className='w-full h-full object-cover'/>
    </div>
  );
};

export default Avatar;
