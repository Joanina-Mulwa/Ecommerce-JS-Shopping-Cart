class Product{

output(){
    document.write("Hello World");
}
}

class Second {

    two(){
        document.write("Hello Worlds");
    }
    }
    

document.write("Heeeeyoo");
var obj = new Product();
var obj2 = new Second();
obj.output().then(obj2.two());