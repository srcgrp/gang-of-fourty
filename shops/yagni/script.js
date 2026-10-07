fetch("../../api/categories.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("challenge1:", data);
  })
  .catch((error) => {
    console.error(error);
  });
//////////////////////////////////
fetch("../../api/broken.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("chanllenge2:", data);
  })
  .catch((error) => {
    console.error(error);
  });
