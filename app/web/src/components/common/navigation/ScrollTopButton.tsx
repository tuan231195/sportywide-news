import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import React, { useEffect } from 'react';
import { useStateRef } from 'src/utils/hooks/basic';

const ScrollTop = styled(Button)`
    display: inline-block;
    background-color: #ff9800;
    width: 50px;
    height: 50px;
    text-align: center;
    border-radius: 4px;
    position: fixed;
    bottom: 30px;
    right: 30px;
    transition: background-color 0.3s, opacity 0.5s, visibility 0.5s;
    z-index: 1000;

    &:hover {
        cursor: pointer;
        background-color: #333;
    }
    &:active {
        background-color: #555;
    }
`;
export function ScrollTopButton() {
    const [isScrolled, setIsScrolled] = useStateRef(false);
    useEffect(() => {
        const listener = () => {
            if (window.scrollY > 0 && !isScrolled()) {
                setIsScrolled(true);
            } else if (isScrolled() && !window.scrollY) {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', listener);
        return () => {
            window.removeEventListener('scroll', listener);
        };
    }, []);

    return (
        isScrolled() && (
            <ScrollTop
                circular
                color={'orange'}
                icon={'arrow up'}
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    })
                }
            />
        )
    );
}
