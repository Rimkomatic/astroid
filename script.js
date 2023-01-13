// console.log("HELLO")
const FPS=30
const friction=2
const roidNum=10
const astroidSpeed=30
const roidVert=10
const roidJagg=0.2
const showBounding=false

const canvas=document.querySelector('canvas')
canvas.width=window.innerWidth
canvas.height=window.innerHeight

const roidSize=canvas.width/8
window.addEventListener("resize",()=>{
    canvas.width=window.innerWidth
    canvas.height=window.innerHeight
})

const context=canvas.getContext("2d")
const shipSize=30
const shipThrust=30
const rotateSpeed=30

setInterval(update,1000/FPS)

let isExpoding=false

let ship={
    x: canvas.width/2,
    y: canvas.height/2,
    r: shipSize/2,
    a: (90/180) * Math.PI,
    rot:0,
    thrusting:false,
    thrust:{
        x:0,
        y:0
    }
}
console.log(ship)

let roids=[]
createAstroidBelt()
// el.addEventListener('touchstart', handleStart);
// el.addEventListener('touchend', handleEnd);

document.addEventListener("keydown", keydown)
document.addEventListener("keyup",keyup)


// UPKEY
document.getElementById("up").addEventListener('touchstart',()=>{
    ship.thrusting=true
})
document.getElementById("up").addEventListener('touchend',()=>{
    ship.thrusting=false
})

// downkey
document.getElementById("down").addEventListener('touchstart',()=>{
    ship.thrust.x-=2*friction*ship.thrust.x/FPS
    ship.thrust.y-=2*friction*ship.thrust.y/FPS
})
document.getElementById("down").addEventListener('touchend',()=>{
    ship.thrusting=false
})

// UPKEY
document.getElementById("left").addEventListener('touchstart',()=>{
    ship.rot=((rotateSpeed / 180)*Math.PI)/FPS
})
document.getElementById("left").addEventListener('touchend',()=>{
    ship.rot=0
})

// UPKEY
document.getElementById("right").addEventListener('touchstart',()=>{
    ship.rot= - ((rotateSpeed / 180)*Math.PI)/FPS
})
document.getElementById("right").addEventListener('touchend',()=>{
    ship.rot=0
})

function createAstroidBelt()
{
    roids=[]
    for(let i=0;i<roidNum;i++)
    {   
        let x
        let y
        do{
            x=Math.random()*canvas.width
            y=Math.random()*canvas.height
        }while(distBetweenPoints(ship.x,ship.y,x,y)<roidSize+ship.r)

        roids.push(newAstroid(x,y))
    }
}

function explodeShip()
{
    isExpoding=true
}

function distBetweenPoints(shipX,shipY,x,y)
{
    return Math.sqrt(Math.pow(x-shipX,2) + Math.pow(y-shipY,2))
}

function newAstroid(x,y)
{
    let roid={
        x: x,
        y: y,
        xv: (Math.random() * astroidSpeed /FPS) * (Math.random() < 0.5 ? 1 : (-1)),
        yv: (Math.random() * astroidSpeed /FPS) * (Math.random() < 0.5 ? 1 : (-1)),
        r: roidSize / 2,
        a: Math.random() * Math.PI * 2,
        vert : Math.floor(Math.random() * (roidVert+1) + roidVert / 2),
        offs: []
    }
    for(let j=0;j<roid.vert;j++)
    {
        roid.offs.push(Math.random()*roidJagg*2 + 1 -roidJagg)
    }

    return roid
}


function keydown(e)
{
    console.log(e)
    if (e.key==='ArrowUp')
    {
        ship.thrusting=true
    }
    else if(e.key==='ArrowDown')
    {
        ship.thrust.x-=2*friction*ship.thrust.x/FPS
        ship.thrust.y-=2*friction*ship.thrust.y/FPS
    }
    else if(e.key==='ArrowLeft')
    {
        ship.rot=((rotateSpeed / 180)*Math.PI)/FPS
    }
    else if(e.key==='ArrowRight')
    {
        ship.rot= - ((rotateSpeed / 180)*Math.PI)/FPS
    }
    else{}
}

function keyup(e)
{
    if (e.key==='ArrowUp')
    {
        ship.thrusting=false
    }
    else if(e.key==='ArrowDown')
    {
        
    }
    else if(e.key==='ArrowLeft')
    {
        ship.rot=0
    }
    else if(e.key==='ArrowRight')
    {
        ship.rot=0
    }
    else{}
}
function update(){
    context.fillStyle='white'
    context.fillRect(0,0,canvas.width,canvas.height)

    if(ship.thrusting && !isExpoding)
    {
        ship.thrust.x +=shipThrust*Math.cos(ship.a) /FPS
        ship.thrust.y -=shipThrust*Math.sin(ship.a) /FPS

        // THRUSTER
        context.fillStyle='red'
        context.strokeStyle = 'yellow';
        context.lineWidth = shipSize / 20;
        context.beginPath();
        context.moveTo( // nose of the ship
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) +0.5*Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5*Math.cos(ship.a))
        );
        context.lineTo( // rear left
            ship.x - ship.r * (6 / 3 * Math.cos(ship.a) ),
            ship.y + ship.r * (6 / 3 * Math.sin(ship.a) )
        );
        context.lineTo( // rear right
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5*Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5*Math.cos(ship.a))
        );
        context.closePath();
        context.fill()
        context.stroke();
    }
    else
    {
        ship.thrust.x-=friction*ship.thrust.x/FPS
        ship.thrust.y-=friction*ship.thrust.y/FPS
    }

    if(!isExpoding)
    {
        context.strokeStyle = 'black';
        context.lineWidth = shipSize / 20;
        context.beginPath();
        context.moveTo( // nose of the ship
            ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
        );
        context.lineTo( // rear left
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
        );
        context.lineTo( // rear right
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
        );
    
        context.closePath();
        context.stroke();
    }
    else
    {
        context.strokeStyle='yellow'
        context.fillStyle='yellow'
        context.beginPath()
        context.arc(ship.x,ship.y,ship.r*3/2,0,Math.PI*2,false)
        context.fill()
        context.stroke()
        
        context.strokeStyle='orange'
        context.fillStyle='orange'
        context.beginPath()
        context.arc(ship.x,ship.y,ship.r,0,Math.PI*2,false)
        context.fill()
        context.stroke()
        
        context.strokeStyle='red'
        context.fillStyle='red'
        context.beginPath()
        context.arc(ship.x,ship.y,ship.r/2,Math.PI*2,false)
        context.fill()
        context.stroke()
        
    }

    if(showBounding)
    {
        context.strokeStyle='red'
        context.beginPath()
        context.arc(ship.x,ship.y,ship.r,0,Math.PI*2,false)
        context.stroke()
    }

    ship.a+=ship.rot*2.5
    ship.x+=ship.thrust.x
    ship.y+=ship.thrust.y


    // ASTROID DRAW-------------
    context.fillStyle='black'
    context.strokeStyle='black'
    context.lineWidth=shipSize/20
    for(let i=0;i<roidNum;i++)
    {
        let x=roids[i].x
        let y=roids[i].y
        let a=roids[i].a
        let r=roids[i].r
        let vert=roids[i].vert
        let offs=roids[i].offs

        context.beginPath()
        context.moveTo(
            x+r*offs[0]*Math.cos(a),
            y+r*offs[0]*Math.sin(a)
        )

        for(let j=1;j<vert;j++)
        {
            context.lineTo(
                x+r*offs[j]*Math.cos(a+j*Math.PI*2/vert),
                y+r*offs[j]*Math.sin(a+j*Math.PI*2/vert)
            )
        }
        context.closePath()
        context.fill()
        context.stroke()

        if(!isExpoding)
        {
            roids[i].x+=roids[i].xv
            roids[i].y+=roids[i].yv
        }
        
        if(roids[i].x<(0-roids[i].r))
        {
            roids[i].x=canvas.width+roids[i].r
        }
        else if(roids[i].x>(canvas.width+roids[i].r))
        {
            roids[i].x=0-roids[i].r
        }
    
        if(roids[i].y<(0-roids[i].r))
        {
            roids[i].y=canvas.height+roids[i].r
        }
        else if(roids[i].y>(canvas.height+roids[i].r))
        {
            roids[i].y=0-roids[i].r
        }

        if(showBounding)
        {
            context.strokeStyle='red'
            context.beginPath()
            context.arc(roids[i].x,roids[i].y,roids[i].r,0,Math.PI*2,false)
            context.stroke()
        }
    
    }

    // Collison check-----------
    for(let i=0;i<roidNum;i++)
    {
        if(distBetweenPoints(ship.x,ship.y,roids[i].x,roids[i].y) < (ship.r + roids[i].r))
        {
            explodeShip()
        }
    }
    
    
    if(ship.x<(0-ship.r))
    {
        ship.x=canvas.width+ship.r
    }
    else if(ship.x>(canvas.width+ship.r))
    {
        ship.x=0-ship.r
    }

    if(ship.y<(0-ship.r))
    {
        ship.y=canvas.height+ship.r
    }
    else if(ship.y>(canvas.height+ship.r))
    {
        ship.y=0-ship.r
    }
}