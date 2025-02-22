const IconMenu = ({
  width = 18,
  height = 18,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-1k33q06"
      focusable="false"
      aria-hidden="true"
      width={width}
      height={height}
      fill="currentColor"
      viewBox="0 0 24 24"
      data-testid="MenuTwoToneIcon"
    >
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
};

export default IconMenu;
