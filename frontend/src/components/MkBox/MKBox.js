import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./MKBox.css";

const MKBox = ({ variant, bgColor, shadow, py, children, className, ...rest }) => {
  const boxClasses = classNames(
    "mk-box",
    {
      [`mk-box--${variant}`]: variant,
      [`mk-box--bg-${bgColor}`]: bgColor,
      [`mk-box--shadow-${shadow}`]: shadow,
      [`mk-box--py-${py}`]: py,
    },
    className
  );

  return (
    <div className={boxClasses} {...rest}>
      {children}
    </div>
  );
};

MKBox.propTypes = {
  variant: PropTypes.oneOf(["gradient", "contained", "outlined"]),
  bgColor: PropTypes.oneOf(["dark", "light", "primary", "secondary"]),
  shadow: PropTypes.oneOf(["sm", "md", "lg"]),
  py: PropTypes.oneOf([0.25, 0.5, 1, 2, 3]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

MKBox.defaultProps = {
  variant: "contained",
  bgColor: "light",
  shadow: "sm",
  py: 1,
  className: "",
};

export default MKBox;