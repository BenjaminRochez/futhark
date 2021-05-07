class Juventus {

    constructor(obj) {
        if (obj) {
            this.init();
        }
        this.url = obj.url;
        this.identifier = obj.identifier

    }

    init() {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText)
                document.getElementById("content").innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", "./content/fehu.txt", true);
        xhttp.send();

    }
}

export default Juventus