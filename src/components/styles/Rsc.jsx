import "@/style/rsc/main.css";
// import "/fonts/RSC-Bold.ttf";

console.log("outer");

const Rsc = () => {

console.log("inner");

return (

    <script>
        console.log("loaded");

    </script>

);


}

export default Rsc;
