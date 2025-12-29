import type { SVGProps } from 'react'
export const PlusCircleOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 36 36" {...props}>
    <g fill="currentColor" clipPath="url(#plus-circle-outline_svg__a)">
      <path d="M18 3a15 15 0 1 0 0 30 15 15 0 0 0 0-30m0 27a12 12 0 1 1 0-24 12 12 0 0 1 0 24" />
      <path d="M22.5 16.5h-3v-3a1.5 1.5 0 1 0-3 0v3h-3a1.5 1.5 0 1 0 0 3h3v3a1.5 1.5 0 1 0 3 0v-3h3a1.5 1.5 0 1 0 0-3" />
    </g>
    <defs>
      <clipPath id="plus-circle-outline_svg__a">
        <path fill="currentColor" d="M0 0h36v36H0z" />
      </clipPath>
    </defs>
  </svg>
)
