import http from "@/http";


const taskManagerListAll = (flinkEnvName, startTs, endTs) => {
  return http.get("/task/manager/listQuery", {params: {flinkEnvName, startTs, endTs}})
}


export {
  taskManagerListAll
}

