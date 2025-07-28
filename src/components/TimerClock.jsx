import React from "react";

const TimerClock = ({ secondsLeft, totalSeconds = 30 }) => {
  const cx = 94, cy = 50, r = 50;
  const innerR = 35;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  
  // Calculate the arc path for the orange fill
  const startAngle = -Math.PI / 2; // Start at top (12 o'clock)
  const endAngle = startAngle + (progress * 2 * Math.PI);
  
  const startX = cx + innerR * Math.cos(startAngle);
  const startY = cy + innerR * Math.sin(startAngle);
  const endX = cx + innerR * Math.cos(endAngle);
  const endY = cy + innerR * Math.sin(endAngle);
  
  const largeArcFlag = progress > 0.5 ? 1 : 0;
  
  // Create the path for the timer fill (pie slice)
  const pathData = progress === 0 ? "" : progress === 1 
    ? `M ${cx} ${cy} m -${innerR} 0 a ${innerR} ${innerR} 0 1 1 ${innerR * 2} 0 a ${innerR} ${innerR} 0 1 1 -${innerR * 2} 0`
    : `M ${cx} ${cy} L ${startX} ${startY} A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

  // Clock hand angle and position
  const handAngle = progress * 360 - 90;
  const handRadians = (handAngle * Math.PI) / 180;
  const handLength = innerR - 8;
  const handX = cx + handLength * Math.cos(handRadians);
  const handY = cy + handLength * Math.sin(handRadians);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="189" height="138" viewBox="0 0 189 138" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="timerClip">
            <circle cx={cx} cy={cy} r={innerR} />
          </clipPath>
        </defs>
        
        {/* Background shapes */}
        <rect y="81" width="189" height="57" rx="13.9426" fill="#1C0F01"/>
        <path d="M51.8606 133C32.0553 133 16 116.944 16 97.139V97.139C16 88.0531 19.4489 79.3059 25.6498 72.665L66.4564 28.9627C81.083 13.2982 105.917 13.2982 120.544 28.9626L161.35 72.665C167.551 79.3059 171 88.0531 171 97.139V97.139C171 116.944 154.945 133 135.139 133H51.8606Z" fill="#1C0F01"/>
        
        {/* Outer circle */}
        <circle cx={cx} cy={cy} r={r} fill="#1C0F01"/>
        
        {/* Inner circle background */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="#f5efd5"
          stroke="#988E36"
          strokeWidth={4}
        />
        
        {/* Timer fill (orange) */}
        {progress > 0 && (
          <path
            d={pathData}
            fill="#F18F01"
            clipPath="url(#timerClip)"
          />
        )}
        
        {/* Clock marks (12, 3, 6, 9 positions) */}
        {[0, 1, 2, 3].map(i => {
          const markAngle = (i * Math.PI) / 2 - Math.PI / 2;
          const markOuterR = innerR - 2;
          const markInnerR = innerR - 8;
          const x1 = cx + markInnerR * Math.cos(markAngle);
          const y1 = cy + markInnerR * Math.sin(markAngle);
          const x2 = cx + markOuterR * Math.cos(markAngle);
          const y2 = cy + markOuterR * Math.sin(markAngle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#988E36"
              strokeWidth={2}
            />
          );
        })}
        
        {/* Clock hand - traditional style */}
        <g>
          {/* Hand shadow for depth */}
          <line
            x1={cx + 1}
            y1={cy + 1}
            x2={handX + 1}
            y2={handY + 1}
            stroke="#333333"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.3}
          />
          
          {/* Main hand */}
          <line
            x1={cx}
            y1={cy}
            x2={handX}
            y2={handY}
            stroke="#000000"
            strokeWidth={3}
            strokeLinecap="round"
          />
          
          {/* Hand tip (arrow-like end) */}
          <polygon
            points={`${handX},${handY} ${handX - 3 * Math.cos(handRadians - 0.3)},${handY - 3 * Math.sin(handRadians - 0.3)} ${handX - 3 * Math.cos(handRadians + 0.3)},${handY - 3 * Math.sin(handRadians + 0.3)}`}
            fill="#000000"
          />
        </g>
        
        {/* Center hub - traditional clock style */}
        <circle cx={cx} cy={cy} r={8} fill="#000000" stroke="#333333" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={5} fill="#1c1c1c" />
        
        {/* Timer text centered in the rectangle */}
        <text
          x="94.5"
          y="115"
          textAnchor="middle"
          fontFamily="'Oswald', Arial, sans-serif"
          fontWeight="bold"
          fontSize="25"
          fill="#F5EFD5"
          letterSpacing="1"
          dominantBaseline="middle"
        >
          {Math.ceil(secondsLeft)} sec left
        </text>
      </svg>
    </div>
  );
};

export default TimerClock;