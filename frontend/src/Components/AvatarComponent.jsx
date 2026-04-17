import React, { useMemo, useState, useEffect } from "react";

const AvatarComponent = ({ name, imageUrl, size = "large", className = "" }) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [imageUrl]);

  const generateInitials = (fullName) => {
    if (!fullName) return "?";
    const nameArray = fullName.trim().split(" ");
    if (nameArray.length === 1) {
      return nameArray[0].substring(0, 2).toUpperCase();
    }
    return (
      nameArray[0][0] + nameArray[nameArray.length - 1][0]
    ).toUpperCase();
  };

  const stringToColor = (string) => {
    if (!string) return "#364EF2"; 

    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const isDefaultPlaceholderImage = (url) => {
    if (!url || typeof url !== "string") return false;
    const normalized = url.toLowerCase();

    if (normalized.includes("googleusercontent.com") || normalized.includes("gravatar.com") || normalized.includes("facebook.com")) {
      return false;
    }

    return (
      normalized === "https://ik.imagekit.io/mspoxwn8v/avatar-default.svg" ||
      normalized.endsWith("avatar-default.svg") ||
      normalized.endsWith("default-avatar.svg") ||
      normalized.includes("/default-avatar") ||
      normalized.includes("/avatar-default")
    );
  };

  const initials = useMemo(() => generateInitials(name), [name]);
  
  const backgroundColor = useMemo(() => stringToColor(name), [name]);

  const sizeStyles = {
    small: { container: "w-8 h-8", text: "text-xs" },
    medium: { container: "w-12 h-12", text: "text-sm" },
    large: { container: "w-16 h-16", text: "text-lg" },
    xlarge: { container: "w-20 h-20", text: "text-2xl" },
  };

  const currentSize = sizeStyles[size] || sizeStyles.large;

 const hasValidImage =
    imageUrl &&
    typeof imageUrl === "string" &&
    imageUrl.trim().length > 0 &&
    !imageLoadError &&
    !isDefaultPlaceholderImage(imageUrl);

  if (hasValidImage) {
    return (
      <img
        src={imageUrl}
        alt={name || "Avatar"}
        className={`${currentSize.container} rounded-full object-cover ${className}`}
        onError={() => setImageLoadError(true)}
      />
    );
  }

  return (
    <div
      className={`${currentSize.container} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{ backgroundColor }}
      title={name}
    >
      <span className={currentSize.text}>{initials}</span>
    </div>
  );
};

export default AvatarComponent;