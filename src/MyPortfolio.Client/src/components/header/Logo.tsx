type Props = {}

export default function Logo({}: Props) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white"
    >
      <rect width="40" height="40" rx="10" className="fill-current" />

      <text
        x="20"
        y="24.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        letterSpacing="-0.5"
        fill="currentColor"
        className="text-white dark:text-black"
      >
        &lt;JM&gt;
      </text>
    </svg>
  );
}