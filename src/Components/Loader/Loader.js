const Loader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ margin: "auto", background: "none", display: "block" }}
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid">
      <circle cx="18" cy="50" r="4" fill="#e15b64">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="0s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="27" cy="61.31370849898476" r="4" fill="#f47e60">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.125s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="36" cy="66" r="4" fill="#f8b26a">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.25s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="45" cy="61.31370849898476" r="4" fill="#abbd81">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.375s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="54" cy="50" r="4" fill="#e15b64">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.5s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="63" cy="38.68629150101524" r="4" fill="#f47e60">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.625s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="72" cy="34" r="4" fill="#f8b26a">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.75s"
          repeatCount="indefinite"></animate>
      </circle>
      <circle cx="81" cy="38.68629150101523" r="4" fill="#abbd81">
        <animate
          attributeName="cy"
          values="34;66;34"
          times="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.875s"
          repeatCount="indefinite"></animate>
      </circle>
    </svg>
  );
};

export default Loader;
