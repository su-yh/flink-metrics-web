import http from "@/http";


const params = {
  taskManagerId: 'localhost:34339-19078e'
};

const taskManagerListAll = () => {
  return http.get("/task/manager/listAll", {params})
}


export {
  taskManagerListAll
}

