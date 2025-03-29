import http from "@/http";


const params = {
  taskManagerId: 'localhost:37303-77efd1'
};

const taskManagerListAll = () => {
  return http.get("/task/manager/listAll", {params})
}


export {
  taskManagerListAll
}

