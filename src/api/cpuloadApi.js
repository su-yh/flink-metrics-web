import http from "@/http";


const params = {
  flinkEnvName: 'suyh'
};

const taskManagerListAll = () => {
  return http.get("/task/manager/listAll", {params})
}


export {
  taskManagerListAll
}

