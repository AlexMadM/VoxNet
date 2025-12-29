import type { SVGProps } from 'react'
export const Captch = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 30 31" {...props}>
    <g filter="url(#captch_svg__a)">
      <path
        fill="#B5B6B5"
        d="m26.44 24.507-5.084-4.577c-1.017 1.018-2.542 3.051-6.61 3.051s-5.593-2.033-7.119-3.559l3.56-4.068H0v12.204l3.05-3.051c1.526 1.525 6 5.593 11.696 5.593s10-3.898 11.695-5.593"
      />
    </g>
    <g filter="url(#captch_svg__b)">
      <path
        fill="#4D8DF4"
        d="m14.237 12.303-3.559-4.067c-3.56 2.034-4.237 5.593-4.068 7.118H0c0-1.017.098-4.313 1.017-6.61 1.017-2.542 3.22-4.237 4.576-5.085L2.543.1h11.694z"
      />
    </g>
    <g filter="url(#captch_svg__c)">
      <path
        fill="#1B3CAC"
        d="m18.305 14.846 3.56-3.56C19.83 7.727 15.931 7.22 14.236 7.22V.1c1.526 0 5.594.508 7.627 2.034 1.898 1.423 3.39 3.05 4.068 4.068l3.56-3.051v11.695z"
      />
    </g>
    <path
      stroke="currentColor"
      strokeWidth={0.2}
      d="m18.305 14.846 3.56-3.56C19.83 7.727 15.931 7.22 14.236 7.22V.1c1.526 0 5.594.508 7.627 2.034 1.898 1.423 3.39 3.05 4.068 4.068l3.56-3.051v11.695z"
    />
    <defs>
      <filter
        id="captch_svg__a"
        width={27.441}
        height={15.746}
        x={0}
        y={14.354}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dx={1} dy={-1} />
        <feGaussianBlur stdDeviation={0.5} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" />
        <feBlend in2="shape" result="effect1_innerShadow_90786_426" />
      </filter>
      <filter
        id="captch_svg__b"
        width={15.237}
        height={16.254}
        x={0}
        y={-0.9}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dx={1} dy={-1} />
        <feGaussianBlur stdDeviation={0.5} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_90786_426" />
      </filter>
      <filter
        id="captch_svg__c"
        width={16.454}
        height={15.946}
        x={14.137}
        y={-1}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dx={1} dy={-1} />
        <feGaussianBlur stdDeviation={0.5} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_90786_426" />
      </filter>
    </defs>
  </svg>
)
