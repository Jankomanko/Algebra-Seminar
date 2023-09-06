let members = [];
let chatHistory = [];
const CHANNEL_ID = 'JE4PK0AAl9ZAHJLh';


const drone = new ScaleDrone(CHANNEL_ID, {
 data: { 
   name: getRandomName(),
   color: getRandomColor(),
 },
});


let myRandomName = getRandomName();
function getRandomName() {
    const adjs = ["Cool", "Snowy", "Handsome", "Salty", "Silent", "Kind", "Dry", "Strong", "Winter", "Spicy", "Delicate", "Quiet", "white", "Icy", "Spring", "Imaginative", "Patient", "Pacijent", "Dinamo", "BBB", "Greatest", "Wathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
    const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
    return (
      adjs[Math.floor(Math.random() * adjs.length)] +
      "_" +
      nouns[Math.floor(Math.random() * nouns.length)]
    );
   }
   function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
   };




   drone.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully connected');
    
    const room = drone.subscribe('observable-room');

    room.on('open', error => {
      if (error) {
        return console.error(error);
      }
      console.log('Successfully joined');
    });

    room.on('members', m => {
        members = m;
         updateMembersDOM(); 

         chatHistory.forEach(message => {
          addMessageToListDOM(message.text, message.member);
        });
       });
        
       room.on('member_join', member => {
        members.push(member);
         updateMembersDOM(); 
       });
        
       room.on('member_leave', ({id}) => {
        const index = members.findIndex(member => member.id === id);
        members.splice(index, 1);
         updateMembersDOM(); 
       });

       room.on('data', (text, member) => {
        if (member) {
           addMessageToListDOM(text, member); 
           chatHistory.push({ text, member });
        } 
       });
    


   });
   const DOM = {
    membersCount: document.querySelector('.members-count'),
    membersList: document.querySelector('.members-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form__input'),
    form: document.querySelector('.message-form'),
   };

    
   function createMemberElement(member) {
    const { name, color } = member.clientData;
    const el = document.createElement('div');

    el.appendChild(document.createTextNode(name));
    el.className = 'member';
    if (member.id === drone.clientId) {
      el.classList.add('member--me'); 
    }
    el.style.color = color;
    return el;
   }


    
    function updateMembersDOM() {
    DOM.membersList.innerHTML = '';
    members.forEach(member =>
      DOM.membersList.appendChild(createMemberElement(member))
    );
   }


    
   function createMessageElement(text, member) {
    const el = document.createElement('div');
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = 'message';
    if (member.id === drone.clientId) {
      el.classList.add('message--right'); 
    }
    return el;
   }
    
   function addMessageToListDOM(text, member) {
    const el = DOM.messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(text, member));
    if (wasTop) {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    }
   };
   DOM.form.addEventListener('submit', sendMessage);
 
   function sendMessage() {
   const value = DOM.input.value;
   if (value === '') {
    return;
   }
   DOM.input.value = '';
    drone.publish({
    room: 'observable-room',
     message: value,
   });
}