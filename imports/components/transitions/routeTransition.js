// import { React, PropTypes } from "react";
// import { TransitionMotion, spring, presets } from "react-motion";

// export default function RouteTransition({ children, pathname }) {
//   const farLeft = -20;
//   const farRight = 20;

//   const lastPart = () => {
//     const pathParts = pathname.split("/");
//     return pathParts[pathParts.length - 1];
//   };

//   const getDirection = (action) => {
//     const isNum = Number(lastPart()) > 0;

//     if (action === "enter") {
//       return isNum ? spring(farRight, presets.stiff) : spring(farLeft, presets.stiff);
//     } else if (action === "leave") {
//       return isNum ? spring(farLeft, presets.stiff) : spring(farRight, presets.stiff);
//     }
//     return null;
//   };

//   const willEnter = (childArgs) =>
//     ({
//       childArgs,
//       opacity: spring(0),
//       translate: getDirection("enter", pathname),
//     });

//   const willLeave = (key, { childArgs }) =>
//     ({
//       childArgs,
//       opacity: spring(0),
//       translate: getDirection("leave", pathname),
//     });

//   const getStyles = (childArgs, pathArgs) =>
//     ({
//       [pathArgs]: {
//         childArgs,
//         opacity: spring(1),
//         translate: spring(0),
//       },
//     });

//   return (
//     <TransitionMotion
//       styles={getStyles(children, pathname)}
//       willEnter={willEnter}
//       willLeave={willLeave}
//     >
//       {(interpolated) =>
//         <div>
//           {Object.keys(interpolated).map((key) =>
//             <div
//               key={`${key}-transition`}
//               style={{
//                 WebkitBackfaceVisibility: "hidden",
//                 WebkitPerspective: 1000,
//                 position: "absolute",
//                 width: "100%",
//                 minHeight: "100%",
//                 paddingBottom: "60px",
//                 opacity: interpolated[key].opacity,
//                 transform: `translate3d(${interpolated[key].translate}%, 0, 0)`,
//               }}
//             >
//               {interpolated[key].children}
//             </div>
//           )}
//         </div>
//       }
//     </TransitionMotion>
//   );
// }

// RouteTransition.propTypes = {
//   children: PropTypes.any, // eslint-disable-line
//   pathname: PropTypes.string,
// };
