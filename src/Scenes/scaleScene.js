import React, {  useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl } from "../components/CommonFunctions";
import { MaskComponent } from '../components/CommonComponents';

let currentMaskNum = 0;
const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()

    const subMarkInfoList = [
        { p: '4', t: 3600 },
        { p: '5', t: 5000 },
        { p: '6', t: 6200 },
        { p: '7', t: 8000 },
    ]

    const subMaskRefList = Array.from({ length: subMarkInfoList.length }, ref => useRef())
    const [isLoadSubPart, setLoadSubPart] = useState(false)

    const [isSceneLoad, setSceneLoad] = useState(false)


    const maskPathList = [
        ['1'],
        ['2'],
        ['3'],
        ['sub'],
        ['8'],
        ['9'],
        ['10'],
        ['11'],
        ['12'],
    ]


    const maskTransformList = [
        // { x: 0.0, y: 0.0, s: 1 },
        { x: 0.2, y: 0.0, s: 1.4 },
        { x: 0.25, y: 0.0, s: 1.5 },
        { x: 0.2, y: 0.0, s: 1.5 },
        { x: 0.1, y: -0.1, s: 1.2 },
        { x: 0.1, y: 0.1, s: 1.2 },
        { x: 0.5, y: -0.5, s: 2 },
        { x: 0.45, y: -0.65, s: 2.3 },
        { x: -0.2, y: 0.2, s: 1.4 }, // 9
        { x: -0.3, y: -0.0, s: 1.6 }, // 9
    ]


    const marginPosList = [
        { s: 3, l: 0.5, t: 0 },
        { s: 3, l: 1, t: 0 },
        { s: 3, l: 0.4, t: 0 },
        {},
        { s: 1.5, l: 0.3, t: 0 },
        { s: 2, l: 0.6, t: -0.5 },
        { s: 2, l: 0.3, t: -0.6 }, //6
        { s: 3, l: -0.3, t: 0.8 }, //7
        { s: 3, l: -0.8, t: 0.0 }, // 9
    ]

    const audioPathList = [
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
        ['7'],
        ['8'],
        ['9'],
        ['10'],
    ]


    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
            
        },
        sceneStart: () => {
            loadFunc()
            baseObject.current.className = 'aniObject'
            audioList.bodyAudio1.src = getAudioPath('intro/2');
            audioList.bodyAudio2.src = getAudioPath('intro/1');

            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[currentMaskNum][0], true) + '")'

            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            setTimeout(() => {
                setLoadSubPart(true)    
                audioList.bodyAudio2.play()
                setTimeout(() => {
                    showIndividualImage()
                }, audioList.bodyAudio2.duration * 1000 + 1000);
            }, 3000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/' + imgName + '.png')
            : ('intro/' + imgName + '.png');
    }

    const durationList = [
        2, 1, 1, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1
    ]
    function showIndividualImage() {


        let currentMaskName = maskPathList[currentMaskNum]
        baseObject.current.style.transition = durationList[currentMaskNum] + 's'


        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = audioList.bodyAudio1.duration * 1000 + 500
            let isSubAudio = false

            if (audioPathList[currentMaskNum].length > 1) {
                timeDuration += (audioList.bodyAudio3.duration * 1000 - 1000)
                isSubAudio = true;
            }

            if (currentMaskName != 'sub') {
                blackWhiteObject.current.className = 'show'
                colorObject.current.className = 'hide'
            }

            else {
                subMarkInfoList.map((info, index) => {
                    setTimeout(() => {
                        if (index == 0)
                            colorObject.current.className = 'hide'
                        subMaskRefList[index].current.setClass('appear')
                    }, info.t);
                })
            }


            setTimeout(() => {

                if (marginPosList[currentMaskNum].s != null) {
                    currentImage.current.style.transform =
                        "translate(" + _baseGeo.width * marginPosList[currentMaskNum].l / 100 + "px,"
                        + _baseGeo.height * marginPosList[currentMaskNum].t / 100 + "px)"
                        + "scale(" + (1 + marginPosList[currentMaskNum].s / 100) + ") "
                }

                audioList.bodyAudio1.play().catch(error => { });
                if (isSubAudio)
                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            audioList.bodyAudio3.play();
                        }, 500);
                    }, audioList.bodyAudio1.duration * 1000 + 500);

                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 1) {
                        audioList.bodyAudio1.src = getAudioPath('intro/' + audioPathList[currentMaskNum + 1][0]);
                        if (audioPathList[currentMaskNum + 1].length > 1)
                            audioList.bodyAudio3.src = getAudioPath('intro/' + audioPathList[currentMaskNum + 1][1]);
                    }

                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskPathList.length - 1) { //
                                setTimeout(() => {
                                    baseObject.current.style.transition = '2s'

                                    baseObject.current.style.transform =
                                        'translate(' + '0%,0%)' +
                                        'scale(1)'

                                    setTimeout(() => {
                                        nextFunc()
                                    }, 5000);

                                }, 2000);
                            }
                            else {


                                if (currentMaskName == 'sub')
                                    subMaskRefList.map(mask => mask.current.setClass('hide'))

                                currentMaskNum++;

                                currentMaskName = maskPathList[currentMaskNum]
                                if (currentMaskName != 'sub')
                                    blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                        returnImgPath(maskPathList[currentMaskNum], true) + '")'

                                blackWhiteObject.current.className = 'hide'
                                setTimeout(() => {
                                    showIndividualImage()
                                }, 2000);

                            }
                        }, 500);
                    }, 2000);
                }, timeDuration);
            }, 1000);

        }, durationList[currentMaskNum] * 1000);
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            src={returnImgPath('grey_bg', true)}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute",
                            width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <div
                            ref={currentImage}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <BaseImage
                                url={returnImgPath('color_bg')}
                            />
                        </div>
                    </div>

                    {
                        isLoadSubPart &&
                        subMarkInfoList.map((value, index) =>
                            <MaskComponent
                                ref={subMaskRefList[index]}
                                maskPath={returnImgPath(value.p, true)}
                            />
                        )
                    }

                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <BaseImage
                            onLoad={bgLoaded}
                            url={returnImgPath('color_bg')}
                        />
                    </div>
                </div>}
        </div >
    );
});

export default Scene;