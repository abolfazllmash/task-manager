"use client";

import React from 'react';

interface ProgressCircleProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress, size = 50, strokeWidth = 5 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
        >
            <circle
                className="text-muted/20"
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className="text-primary transition-all duration-300 ease-in-out"
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                className="text-base font-bold fill-foreground rotate-90 origin-center"
            >
                {`${Math.round(progress)}%`}
            </text>
        </svg>
    );
};

export default ProgressCircle;
