import { useMediaQuery } from 'react-responsive';
import React from 'react';
import { Segment } from 'semantic-ui-react';
import { size } from 'src/utils/device/size';

export const VnLaptop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: size.laptop });
    return isDesktop ? children : null;
};
export const VnTablet = ({ children }) => {
    const isTablet = useMediaQuery({
        minWidth: size.tablet,
        maxWidth: size.laptop - 1,
    });
    console.log(isTablet, size);
    return isTablet ? children : null;
};

export const VnBigScreen = ({ children }) => {
    const isBigScreen = useMediaQuery({ minWidth: size.tablet });
    return isBigScreen ? children : null;
};

export const VnMobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: size.tablet - 1 });
    return isMobile ? children : null;
};

export const VnMobileL = ({ children }) => {
    const isMobile = useMediaQuery({
        minWidth: size.mobileL,
        maxWidth: size.tablet - 1,
    });
    return isMobile ? children : null;
};

export const VnMobileM = ({ children }) => {
    const isMobile = useMediaQuery({
        minWidth: size.mobileM,
        maxWidth: size.mobileL - 1,
    });
    return isMobile ? children : null;
};

export const VnMobileS = ({ children }) => {
    const isMobile = useMediaQuery({
        minWidth: size.mobileS,
        maxWidth: size.mobileM - 1,
    });
    return isMobile ? children : null;
};

export const VnResponsiveSegment = ({ children, className }) => {
    const isBigScreen = useMediaQuery({ minWidth: size.tablet });
    return isBigScreen ? (
        <Segment className={className}>{children}</Segment>
    ) : (
        <div className={className}>{children}</div>
    );
};
