import { addTag } from "@/api/tags";
const defaultTags = ["Completed", "Incompleted", "Favourite"];

export const addDefaultTags = async () => {
  for (const tag of defaultTags) {
    await addOneTag(tag);
  }
  return;
};

function addOneTag(tag) {
  return new Promise((resolve, reject) => {
    addTag({
      TagName: tag,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log("error in adding default tags");
        reject(error);
      });
  });
}
