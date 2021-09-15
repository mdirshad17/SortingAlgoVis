let a = document.getElementById("array");
let selectEle = document.getElementById("sortingAlgos");
let btnEle = document.getElementById("startSort");
let rangeEle = document.getElementById("size");
let speedEle = document.getElementById("speed");
let stopBtn = document.getElementById("stopSort");
let continueBtn = document.getElementById("continueSort")
let delay = 1000;
let started = false;
let stop = 0;
let n=0;
let timeTaken = 0;
let swapsDone = 0;
let comparisonsDone = 0;
setSize();

stopBtn.addEventListener('click', ()=>{stop = 1;});

function setSpeed()
{
    let speed = parseFloat(speedEle.value);
    delay=(1000/speed);
}

speedEle.addEventListener('change', setSpeed);

function setSize(){
    while(n>0)
    {
        a.removeChild(a.lastChild);
        n--;
    }
    n = parseInt(rangeEle.value);
    width ="10px";
    if(n>50)
        width = "5px";
    for(let i=0;i<n;i++)
    {
        let newEle = document.createElement("li");
        newEle.classList.add("element");
        newEle.textContent = Math.ceil(Math.random()*99+1);
        newEle.style.height = newEle.textContent*2 + "px";
        newEle.style.padding = width;
        a.appendChild(newEle);
    }
}

rangeEle.addEventListener('change',setSize);

function checkStop(){
    return new Promise((resolve)=>{
        if(stop==0)
            resolve();
        else
        {
            continueBtn.addEventListener('click', ()=>{stop = 0;resolve();});
        }    
    })
}

async function sleep(ms){
    await checkStop();
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function insertionSort()
{
    for(let i=0;i<n;i++)
    {
        a.children[i].classList.add("sorted");
        let key=parseInt(a.children[i].textContent) ;
        let j;
        for(j=i-1;j>=0;j--)
        {
            a.children[j+1].classList.add("active");
            await sleep(delay);
            a.children[j+1].classList.remove("active"); 
            if(parseInt(a.children[j].textContent)>key)
            {
                // a.children[j].classList.remove("active"); 
                
                a.children[j+1].textContent=a.children[j].textContent;
                a.children[j].textContent = key;
                a.children[j].style.height = a.children[j].textContent*2+"px";
                a.children[j+1].style.height = a.children[j+1].textContent*2+"px";
            }
            else
            {
                break;
            }      

        }
        // a.children[j+1].textContent=key;
    }
    for(let i=0;i<n;i++)
    {
         a.children[i].classList.remove("sorted");
    }
}

async function merge(L,R,l,r,n1,n2)
{
    let j=0,k=0;    
        
        for(let i=l;i<=r;i++)
        {
            // console.log("start sleeping");
            a.children[i].classList.add("active");
            a.children[i].classList.add("sorted");
            await sleep(delay);
            a.children[i].classList.remove("active");
            // console.log("end sleeping");
            if(j<n1&&k<n2)
            {
                comparisonsDone++;
                if(L[j]>R[k])
                {
                    // t[i] = R[k];
                    a.children[i].textContent=R[k];
                    a.children[i].style.height = a.children[i].textContent*2+"px";
                    k++;
                }
                else
                {
                    // t[i] = L[j];
                    a.children[i].textContent=L[j];
                    a.children[i].style.height = a.children[i].textContent*2+"px";
                    j++;
                }
            }
            else if(j>=n1)
            {
                // t[i] = R[k];
                a.children[i].textContent=R[k];
                a.children[i].style.height = a.children[i].textContent*2+"px";
                k++;
            }
            else if(k>=n2)
            {
                // t[i] = L[j];
                a.children[i].textContent=L[j];
                a.children[i].style.height = a.children[i].textContent*2+"px";
                j++;
            }
        }

        for(let i=l;i<=r;i++)
        {
            a.children[i].classList.remove("sorted");
        }
        
}

async function mergeSort(l,r)
{
    if(l<r)
    {
        let m=parseInt((l+r)/2);//same as (l+r)/2 but prevents overflow in cases of large input
        await mergeSort(l,m);
        await mergeSort(m+1,r);
        let n1=m-l+1;
        let n2=r-m;
        let L=[],R=[];
        for(let i=0;i<n1;i++)
        {
            L.push(parseInt(a.children[i+l].textContent));
        }
        for(let i=0;i<n2;i++)
        {
            R.push(parseInt(a.children[i+m+1].textContent));
        }
        await merge(L,R,l,r,n1,n2);  
    }
}

async function Hoare_partition(l,r)
{
    let pivot=parseInt(a.children[l].textContent);
    
    a.children[l].classList.add("sorted");
    let i=l-1;
    let j=r+1;
    while(true)
    {
        do
        {
            
            j=j-1;
            a.children[j].classList.add("active");
            await sleep(delay);
            a.children[j].classList.remove("active");
        }while(parseInt(a.children[j].textContent)>pivot);
        a.children[j].classList.add("selected1");
        do
        {
            i=i+1;
            a.children[i].classList.add("active");
            await sleep(delay);
            a.children[i].classList.remove("active");
        }while(parseInt(a.children[i].textContent)<pivot);
        a.children[i].classList.add("selected2");
        comparisonsDone++;
        if(i<j)
        {
            await sleep(500);
            swapsDone++;
            let temp = a.children[i].textContent;
            a.children[i].textContent = a.children[j].textContent;
            a.children[j].textContent = temp;
            a.children[i].style.height = a.children[i].textContent*2+"px";
            a.children[j].style.height = a.children[j].textContent*2+"px";
            a.children[i].classList.remove("selected2");
            a.children[j].classList.remove("selected1");
            
        }
        else    
        {
            a.children[i].classList.remove("selected2");
            a.children[j].classList.remove("selected1");
            a.children[l].classList.remove("sorted");
            return j;
        }
    }
}

async function quickSort(l,r)
{
    if(l<r)
    {
        //For Hoare's partition
        let pivot=await Hoare_partition(l,r);
        await quickSort(l,pivot);
        await quickSort(pivot+1,r);
    }
}

async function bubbleSort()
{
    for(let i=n-1;i>0;i--)
    {
        // let swapped=0;
        for(let j=0;j<i;j++)
        {
            a.children[j+1].classList.add("selected2");
            a.children[j].classList.add("selected1");
            await sleep(delay/2);
            comparisonsDone++;
            if(parseInt(a.children[j].textContent)>parseInt(a.children[j+1].textContent))
            {
                swapsDone++;
                let temp=a.children[j].textContent;
                a.children[j].textContent=a.children[j+1].textContent;
                a.children[j+1].textContent=temp;
                a.children[j+1].style.height = a.children[j+1].textContent*2+"px";
                a.children[j].style.height = a.children[j].textContent*2+"px";
                // swapped=1;
            }
            await sleep(delay/2);
            a.children[j+1].classList.remove("selected2");
            a.children[j].classList.remove("selected1");
        }
        // if(swapped==0)
        //         break;
        a.children[i].classList.add("sorted");
    }
}



async function sort()
{
    if(n==0)
        alert("Cannot sort empty array");
    else
    {
        if(!started)
        {
            started = true;
            console.log("started");
            let choice = parseInt(selectEle.value);
            switch(choice)
            {
                case 0: await insertionSort();
                        break;
                case 1: await bubbleSort();
                        break;
                case 2: await mergeSort(0,n-1);
                        break;
                case 3: await quickSort(0,n-1);
                        break;
                default : alert("Invalid Choice");
            }
            console.log("end");
            started = false;
        }
    }
}

btnEle.addEventListener('click', sort);
