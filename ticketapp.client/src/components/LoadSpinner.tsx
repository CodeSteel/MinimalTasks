import {CSSProperties} from "react";
import {SquareLoader} from "react-spinners";

export default function LoadSpinner()
{
    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };
    
    return (
        <div className="m-auto">
            <SquareLoader
                color="#000"
                loading={true}
                cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}