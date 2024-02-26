const badRequestResponse =  {
    statusCode: 400,
    body: JSON.stringify({
      messgae: "Bad request",
  }),
  };

const unAuthorizedResponse = {
    statusCode : 401,
    body: JSON.stringify({
        message : "unauthorized user"
    })
}

module.exports={
    badRequestResponse,
    unAuthorizedResponse
}