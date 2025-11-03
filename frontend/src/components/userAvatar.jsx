const UserAvatar = ({ username }) => {
  const colors = [
    "bg-red-300",
    "bg-cyan-300",
    "bg-orange-300",
    "bg-pink-300",
    "bg-violet-300",
    "bg-fuchsia-300",
    "bg-rose-300",
    "bg-teal-300",
  ];

  const getRandomElement = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
  };

  const getInitials = (username) => {
    const nameParts = username.trim().split(" ");
    let initials = "";

    if (nameParts.length > 0) {
      initials += nameParts[0].charAt(0);
    }

    if (nameParts.length > 1) {
      initials += nameParts[nameParts.length - 1].charAt(0);
    }

    return initials.toUpperCase();
  };

  const getColorFromUsername = (username) => {
    const hash = [...username].reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    return colors[hash % colors.length];
  };

  const initials = getInitials(username);
  // const color = getRandomElement(colors);
  const color = getColorFromUsername(username);

  return (
    <div
      className={`${
        username
          ? `w-8 h-8 rounded-full border-2 border-white ${color} text-black text-bold text-center `
          : "hidden"
      }  `}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
