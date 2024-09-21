import {ReactNode} from "react";
import {MakeOptional} from "@mui/x-charts/internals";
import {PieChart, PieValueType} from "@mui/x-charts";

export default function CardComponent(props:{ title: string, stats: { value: number, name: string, icon: ReactNode }[],  pies?: MakeOptional<PieValueType, "id">[][], children?: ReactNode })
{
    return (
        <div className="border border-true-gray-300 shadow-2xl p-3 rounded mx-auto flex flex-col">
            <h1 className="ml-3 mt-2 text-xl">{props.title}</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-2 mb-5 ">
                {props.stats.map((stat,index) => (
                    <div key={index} className="border border-true-gray-300 shadow-xl p-3 rounded flex flex-col">
                        <span className="flex items-center px-5 mx-auto space-x-3">
                            {stat.icon}
                            <h1 className="mt-2 text-xl">{stat.name}</h1>
                        </span>
                        <span className="text-center m-auto flex ">
                            <span className="flex flex-col w-full items-center space-y-2 px-4">
                                <h1 className="text-2xl font-black text-true-gray-700">{stat.value}</h1>
                            </span>
                        </span>
                    </div>
                ))}
            </div>
            <span className="flex">
                {props.pies?.map((pie, index) => (
                    <PieChart
                        key={index}
                        className={"mx-auto"}
                        series={[
                            {
                                data: pie
                            },
                        ]}
                        width={500}
                        height={200}
                    />
                ))}
            </span>
        </div>
    )
}