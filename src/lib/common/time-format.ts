export const getAge = (birthdate: string) => {
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(birthdate.substring(0, 4));
  return currentYear - birthYear;
};
