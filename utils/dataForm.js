function dataform(state ,code ,message ,data){
    return {
        state: state || "faild",
        stateCode: code || 400 ,
        message: message || "something went wrong ,try again." ,
        data: data || [],
    };
}

module.exports = dataform;