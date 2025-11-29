import React from "react";

export default function FacultyTopbar({ title, user }) {
  const fullName = user
  ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
  : "Faculty Name";
  const encodedName = encodeURIComponent(fullName || "User");

  // Generate avatar link using initials
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}`;

  return (
    <div className="topbar">
      <h2>{title}</h2>

      <div className="fac-info">
        <img
          src={avatarUrl}
          alt="faculty"
        />
        <div>
          <div className="name">{fullName}</div>
        </div>
      </div>
    </div>
  );
}
