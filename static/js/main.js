var chess = (function(){

    var requests = m.prop([]);

    function getRequests(){
        return requests;
    }

    window.setInterval(function(){
        console.log("then");
        m.request({method: "GET", url: "/list"}).then(
            function(array){
                return array.sort(function(a,b){
                    if(a.count<b.count) {
                        return 1;
                    }
                    if(a.count>b.count) {
                        return -1;
                    }
                    return 0;
                })
            }
        ).then(requests);
    }, 500);

    return {
        getRequests: getRequests
    };
})();


var RequestList = {
    controller: function(){
        this.requests = chess.getRequests();
    },
    view: function(ctrl){
        return ctrl.requests().map(function(data){
            return m("div", {class:"request"},[
                m("span", {class:"value"}, data.value),
                m("span", {class:"count"}, data.count)
            ]);
        });
    }
};

m.module(document.getElementById("content"), RequestList);
