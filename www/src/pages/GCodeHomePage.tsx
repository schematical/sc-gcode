
// import * as gcode from 'gcode';
import * as THREE from 'three'
import {Canvas, useThree} from 'react-three-fiber';
import {useGLTF, Stage, OrbitControls, Edges, Line} from "@react-three/drei"
import React, {useRef, useState} from "react";
interface Coord  {
    x?: number,
    y?: number,
    z?: number,
};
interface GCodeHomePageState{
    points: THREE.Vector3[];
    renderPoints?: THREE.Vector3[];
}
function GCodeHomePage() {
    const [state, setState] = useState<GCodeHomePageState>({
        points: []
    });
    const ref = useRef()
    async function handleUpload(event: any) {


        event.preventDefault();
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        const reader = new FileReader();
        // await new Promise<void>((resolve) => {
            reader.onload = async () => {
                if (!reader.result) {
                    throw new Error("Missing `reader.result`");
                }
                console.log("reader.result", reader.result);
                const coords: Coord[] = [];
                const lines = (reader.result as string).split("\n")
                lines.forEach((line: string) => {
                    const parts = line.split(' ');
                    let coord: Coord | null = null;
                    parts.forEach((part) => {
                        const firstLetter = part.substring(0,1);
                        switch (firstLetter){
                            case("X"):
                                coord = coord || {};
                                coord.x = parseFloat(part.substring(1));
                            break;
                            case("Y"):
                                coord = coord || {};
                                coord.y = parseFloat(part.substring(1));
                                break;
                            case("Z"):
                                coord = coord || {};
                                coord.z = parseFloat(part.substring(1));
                                break;
                        }
                    });
                    if (coord) {
                        coords.push(coord);
                    }
                });
                console.log("coords", coords);
                const prevCoord = {
                    x:0,
                    y:0,
                    z:0
                }
                const points: THREE.Vector3[] = [];
                points.push(new THREE.Vector3(
                    prevCoord.x,
                    prevCoord.y,
                    prevCoord.z
                ))
                coords.forEach((coord) =>{
                    if (coord.x !== undefined) {
                        prevCoord.x = coord.x;
                    }
                    if (coord.y !== undefined) {
                        prevCoord.y = coord.y;
                    }
                    if (coord.z !== undefined) {
                        prevCoord.z = coord.z;
                    }
                    points.push(new THREE.Vector3(
                        prevCoord.x,
                        prevCoord.y,
                        prevCoord.z
                    ))
                });

                setState({
                    points
                })
            }
        reader.onerror = error => console.log(error);
        reader.readAsText(files[0]);
        // });

    }
    const Model = () => {

        const {
            camera,
            gl: {domElement}
        } = useThree()
        return (
            <group dispose={null}>
                { state.renderPoints &&
                    <Line points={state.renderPoints}>
                        <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={10} linecap={'round'} linejoin={'round'} />
                    </Line>
                }
            </group>
        );

    }

    function renderToLine(index: number) {

        const renderPoints = state.points.slice(0, index + 1);

        setState({
            ...state,
            renderPoints
        });
    }

    return (
        <div className="container-fluid">
            <div className="row align-items-center text-center header-background">
                <div className="col">
                    <h1><span>About Us</span></h1>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">GCode File</label>
                        <input type="file" className="form-control" id="exampleInputEmail1"
                               aria-describedby="emailHelp" placeholder="Upload a file"  onChange={handleUpload} />

                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col" style={{height: '500Px'}}>
                    <Canvas>

                        <Stage>{/*castShadow={{ resolution: 1024, scale: 10 }}>*/}
                            <Model />
                        </Stage>
                        <OrbitControls />
                    </Canvas>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">X</th>
                            <th scope="col">Y</th>
                            <th scope="col">Z</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                state.points.map((coord, index) => {
                                   return  <tr key={index}>
                                        <th scope="row">{ index }</th>
                                        <td>{ coord.x }</td>
                                        <td>{ coord.y }</td>
                                        <td>{ coord.z }</td>
                                       <td>
                                           <button className="btn" onClick={() => renderToLine(index)}> Go</button>
                                       </td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}
export default GCodeHomePage;