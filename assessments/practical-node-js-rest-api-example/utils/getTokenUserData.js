const getTokenUserData = (user) => {
  return { name: user.name, userId: user._id };
};

export default getTokenUserData;
