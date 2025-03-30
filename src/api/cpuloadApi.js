import http from "@/http";


const taskManagerListAll = (flinkEnvName, startTs, endTs) => {
  return http.get("/task/manager/listQuery", {params: {flinkEnvName, maxNumber: 300, startTs, endTs}})
}


export {
  taskManagerListAll
}

