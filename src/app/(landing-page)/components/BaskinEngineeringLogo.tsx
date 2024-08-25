'use client'

import Image from "next/image";
import { useColorScheme } from "@mui/joy/styles";
import React from "react";

export default function BaskinEngineeringLogo() {
    const {mode, systemMode} = useColorScheme();
    console.log(mode, systemMode)
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
      localStorage.clear();
      setMounted(true);
    }, []);
    if (!mounted) {
      return null;
    }
    return (
        <a 
        href='https://engineering.ucsc.edu/'
        target="_blank" 
        rel="noopener noreferrer">
            {mode == "dark" || (mode == "system" && systemMode == "dark") ? 
              <Image 
              src={'https://bpb-us-w2.wpmucdn.com/wordpress.ucsc.edu/dist/6/29/files/2022/07/UCSC_Baskin-Engineering-326x50-1.png'} 
              alt = 'Baskin Engineering Logo'
              width={652}
              height={100}
              style={{ width: '100%', height: 'auto' }} // Scale down image while maintaining aspect ratio
              priority
            />
            : 
              <Image 
                src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQme9TIhpDAYJbKnPDIe93QS-lUS1ylQumySA&s'} 
                alt = 'Baskin Engineering Logo'
                width={652}
                height={100}
                style={{ width: '100%', height: 'auto' }} // Scale down image while maintaining aspect ratio
                priority
              />
            }
        </a>
    );
}