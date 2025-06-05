 /**
 * The GenX Edit Poll Widget
 * A standalone poll widget that can be embedded in newsletters and websites
 */
 constGenXEditPoll=(function(){
 // Poll data structure
 letpollData={
 title:"The GenX Edit: Poll of the Week",
 question:"What was your vibe in June 1984?",
 options:[
 "Skate rink slow dances to \"Almost Paradise\"",
 "Mall rat with Aqua Net and strong opinions about Molly Ringwald",
 "MTV addict with a cassette collection organized by mood",
 "Too young for any of this, but still catching feels from the reruns"
 ],
 results:[0,0,0,0],
 totalVotes:0,
 userVoted:false,
 userSelection:null,
 hideTotalVotes:false
 };
 // Initialize the poll
 functioninit(containerId,config){
 // Get container
 constcontainer=document.getElementById(containerId);
 if(!container)return;
 // Apply configuration
 if(config){
 pollData.title=config.title||pollData.title;
 pollData.question=config.question||pollData.question;
 pollData.options=config.options||pollData.options;
 pollData.hideTotalVotes=config.hideTotalVotes||false;
 // Reset results array to match options length
 pollData.results=Array(pollData.options.length).fill(0);
 }
 // Load saved data
 loadPollData();
 // Create poll HTML
 createPollHTML(container,config);
 // Add event listeners
 addEventListeners(container);
 }
 3. 
// Create poll HTML
 functioncreatePollHTML(container,config){
 // Apply styles
 conststyles=document.createElement('style');
 styles.textContent=`
            .genx-poll-widget {
                background-color: #f5f5f5;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                margin-bottom: 20px;
                font-family: Arial, sans-serif;
            }
            .genx-poll-header {
                background-color: ${config?.primaryColor||'#8e44ad'};
                color: white;
                padding: 15px 20px;
                font-size: 18px;
                font-weight: bold;
            }
            .genx-poll-question {
                padding: 20px;
                font-size: 16px;
                color: #333333;
                border-bottom: 1px solid #dddddd;
            }
            .genx-poll-options {
                padding: 10px 20px;
            }
            .genx-poll-option {
                padding: 12px 15px;
                margin: 8px 0;
                background-color: white;
                border: 1px solid #dddddd;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            .genx-poll-option:hover {
                border-color: ${config?.primaryColor||'#8e44ad'};
                background-color: #f9f9f9;
            }
            .genx-poll-option.selected {
                border-color: ${config?.primaryColor||'#8e44ad'};
                background-color: rgba(142, 68, 173, 0.05);
            }
            .genx-poll-footer {
                padding: 15px 20px;
                text-align: right;
                border-top: 1px solid #dddddd;
            }
            .genx-poll-button {
                background-color: ${config?.primaryColor||'#8e44ad'};
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            }
            .genx-poll-button:hover {
                opacity: 0.9;
            }
            .genx-poll-button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
            .genx-poll-results {
                padding: 10px 20px;
                display: none;
            }
            .genx-result-item {
                margin: 15px 0;
            }
            .genx-result-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .genx-result-bar-container {
                height: 20px;
                background-color: #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
            }
            .genx-result-bar {
                height: 100%;
                background-color: ${config?.resultBarColor||'#8e44ad'};
                border-radius: 10px;
                transition: width 1s ease-out;
            }
            .genx-poll-total {
                text-align: center;
                font-size: 14px;
                color: #777;
                margin-top: 15px;
                font-style: italic;
            }
            .genx-poll-message {
                text-align: center;
                padding: 15px;
                color: ${config?.primaryColor||'#8e44ad'};
                font-weight: bold;
            }
        `;
 // Create poll HTML
 constpollHTML=`
            <div class="genx-poll-widget" id="genx-poll-${containerId}">
                <div class="genx-poll-header">${pollData.title}</div>
                <div class="genx-poll-question">${pollData.question}</div>
                <div class="genx-poll-options">
 ${pollData.options.map((option,index)=>`
                        <div class="genx-poll-option ${pollData.userVoted&&
 pollData.userSelection===index?'selected' : ''}" data-index="${index}">
 ${option}
                        </div>
                    `).join('')}
                </div>
                <div class="genx-poll-footer">
                    <button class="genx-poll-button" ${pollData.userSelection===null?
 'disabled' : ''}>Vote</button>
                </div>
                <div class="genx-poll-results" ${pollData.userVoted?'style="display: 
block;"' : ''}>
 ${pollData.options.map((option,index)=>{
 constvotes=pollData.results[index];
 constpercentage=pollData.totalVotes>0?Math.round((votes/
 pollData.totalVotes)*100):0;
 return`
                            <div class="genx-result-item">
                                <div class="genx-result-label">
                                    <span>${option}</span>
                                    <span>${votes} (${percentage}%)</span>
                                </div>
                                <div class="genx-result-bar-container">
                                    <div class="genx-result-bar" style="width: ${percentage}%;"></
 div>
                                </div>
                            </div>
                        `;
 }).join('')}
                    <div class="genx-poll-total" ${pollData.hideTotalVotes?'style="display: 
none;"' : ''}>Total votes: ${pollData.totalVotes}</div>
                </div>
                <div class="genx-poll-message"></div>
            </div>
        `;
 // Add styles and HTML to container
 container.innerHTML='';
 container.appendChild(styles);
 container.insertAdjacentHTML('beforeend',pollHTML);
 }
 // Add event listeners
 functionaddEventListeners(container){
 // Get elements
 constpollWidget=container.querySelector('.genx-poll-widget');
 constoptions=pollWidget.querySelectorAll('.genx-poll-option');
 constvoteButton=pollWidget.querySelector('.genx-poll-button');
 constpollResults=pollWidget.querySelector('.genx-poll-results');
 constpollMessage=pollWidget.querySelector('.genx-poll-message');
 // Add click event to options
 options.forEach(option=>{
 option.addEventListener('click',()=>{
 // If user has already voted, don't allow selection
 if(pollData.userVoted)return;
 // Get index
 constindex=parseInt(option.dataset.index);
 // Update selection
 pollData.userSelection=index;
 // Update UI
 options.forEach(opt=>opt.classList.remove('selected'));
 option.classList.add('selected');
 // Enable vote button
 voteButton.disabled=false;
 });
 });
 // Add click event to vote button
 voteButton.addEventListener('click',()=>{
if(pollData.userSelection===null)return;
 // Increment vote count
 pollData.results[pollData.userSelection]++;
 pollData.totalVotes++;
 pollData.userVoted=true;
 // Save data
 savePollData();
 // Update results
 updateResults(pollWidget);
 // Show results
 pollResults.style.display='block';
 // Show thank you message
 pollMessage.textContent='Thanks for voting!';
 setTimeout(()=>{
 pollMessage.textContent='';
 },3000);
 });
 }
 // Update results
 functionupdateResults(pollWidget){
 // Get elements
 constpollResults=pollWidget.querySelector('.genx-poll-results');
 constpollTotal=pollWidget.querySelector('.genx-poll-total');
 // Clear results container
 pollResults.innerHTML='';
 // Add result items
 pollData.options.forEach((option,index)=>{
 constvotes=pollData.results[index];
 constpercentage=pollData.totalVotes>0?Math.round((votes/
 pollData.totalVotes)*100):0;
 constresultItem=document.createElement('div');
 resultItem.className='genx-result-item';
 constresultLabel=document.createElement('div');
 resultLabel.className='genx-result-label';
 constoptionText=document.createElement('span');
 optionText.textContent=option;
 constvoteCount=document.createElement('span');
 voteCount.textContent=`${votes} (${percentage}%)`;
 resultLabel.appendChild(optionText);
resultLabel.appendChild(voteCount);
 constbarContainer=document.createElement('div');
 barContainer.className='genx-result-bar-container';
 constbar=document.createElement('div');
 bar.className='genx-result-bar';
 bar.style.width=`${percentage}%`;
 barContainer.appendChild(bar);
 resultItem.appendChild(resultLabel);
 resultItem.appendChild(barContainer);
 pollResults.appendChild(resultItem);
 });
 // Add total votes
 consttotalElement=document.createElement('div');
 totalElement.className='genx-poll-total';
 totalElement.textContent=`Total votes: ${pollData.totalVotes}`;
 totalElement.style.display=pollData.hideTotalVotes?'none' : 'block';
 pollResults.appendChild(totalElement);
 }
 // Save poll data to localStorage
 functionsavePollData(){
 try{
 localStorage.setItem('genxEditPollData',JSON.stringify(pollData));
 }catch(e){
 console.error('Failed to save poll data:',e);
 }
 }
 // Load poll data from localStorage
 functionloadPollData(){
 try{
 constsavedData=localStorage.getItem('genxEditPollData');
 if(savedData){
 constparsedData=JSON.parse(savedData);
 // Only load results and user voting status
 pollData.results=parsedData.results||
 Array(pollData.options.length).fill(0);
 pollData.totalVotes=parsedData.totalVotes||0;
 pollData.userVoted=parsedData.userVoted||false;
 pollData.userSelection=parsedData.userSelection;
 // Ensure results array matches options length
 if(pollData.results.length!==pollData.options.length){
 pollData.results=Array(pollData.options.length).fill(0);
 pollData.totalVotes=0;
pollData.userVoted = false;
 pollData.userSelection = null;
 }
 }
 } catch (e) {
 console.error('Failed to load poll data:', e);
 }
 }
 // Public API
 return {
 init: init
 };
 })();
