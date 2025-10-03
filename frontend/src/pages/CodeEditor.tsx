import { Users } from "lucide-react";
import { useEffect } from "react";

export default function CodeEditor() {
    useEffect(() => {
        handleChange();
    }, []);

    function handleChange() {
        const textNumber = document.getElementById("textLines");
        const textlines = document.getElementById("area");

        //@ts-ignore
        const lines = textlines?.value.split('\n').length;
        let lineNumbers = "";

        for(let i=1; i<=lines; i++){
            lineNumbers += i + "\n"
        }

        //@ts-ignore
        textNumber.textContent = lineNumbers;
    }

    function handleScroll(){
        const textNumber = document.getElementById("textLines");
        const textlines = document.getElementById("area");

        //@ts-ignore
        textNumber?.scrollTop = textlines?.scrollTop;
    }

  return (
    <div className="">
        <div className="w-full m-0">
            <div className="h-screen flex flex-row">

                {/* sidebar */}
                <div className="min-w-[20vw] bg-gray-600">
                    <div className="w-full h-full flex flex-col relative">


                        <div className="flex flex-row items-center justify-center gap-2 mt-8">
                            <Users className="w-8 h-8 text-amber-50" />
                            <h1 className="font-bold text-2xl text-amber-50">Code Editor</h1>
                        </div>

                        {/* Users */}

                        <div className="flex flex-col pl-5 mt-6">
                            <p className="text-amber-50">Members</p>
                            <div className="flex flex-row gap-3">

                            </div>
                        </div>

                        <div className="absolute bottom-0 flex pl-8 pb-8 flex-row gap-3">
                            <button className="bg-red-400 text-amber-50 text-sm p-2 rounded-2xl">Copy room id</button>
                            <button className="bg-red-400 text-amber-50 text-sm p-2 rounded-2xl">Leave Room</button>
                        </div>
                    </div>
                </div>

                {/* editor */}
                <div className="w-full bg-white flex flex-row">
                    <div id="textLines" className="w-[5vh] shadow-xl shadow-gray-400"></div>
                    <textarea
                        id="area" 
                        className="w-full pl-4 pt-2 border-none outline-none shadow-none focus:outline-none focus:border-none"
                        onInput={handleChange}
                        onScroll={handleScroll}
                        ></textarea>
                </div>
            </div>
        </div>
    </div>
  )
 
}