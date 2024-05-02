import db from "../config/db.js"

export const getCourseList = async(req, res) => {
  
    // 비지니스 로직 (service) -> repository
    // DB에서 코스 리스트를 가져와서 전달해준다.
const QUERY = "SELECT c.* FROM course c";
    const result = await db.execute(QUERY).then((result)=>result[0]);
    res.status(200).json({ status: "success", message: "성공", data: result });
console.log(result)
}
