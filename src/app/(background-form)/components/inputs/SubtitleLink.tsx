import React from 'react';
import Typography from '@mui/material/Typography';

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode; // Optional icon prop
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, icon }) => {
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none',
          color: '#03a9f4', // Blue color similar to links
          fontWeight: 500,
        }}
        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}  // Add underline on hover
        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}       // Remove underline when not hovered
      >
        <Typography variant='body2' component="span">
          {children}
        </Typography>
        {icon && (
          <Typography variant='body2' component="span" sx={{ ml: 0.2 }}>
            {icon}
          </Typography>
        )}
      </a>
    </>
  );
};

export default CustomLink;
