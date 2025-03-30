import http from "@/http";


const params = {
  flinkEnvName: 'suyh'
};

const taskManagerListAll = () => {
  return http.get("/task/manager/listQuery", {params})
}


export {
  taskManagerListAll
}

