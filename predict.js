#!/usr/bin/env node

const automl = require('@google-cloud/automl').v1beta1;
const fs = require('fs');

var modelToName = {"ICN4561882423435467639":"scissors","ICN8184770348997403596":"saxophone","ICN2073879833513191514":"saw","ICN4182403732620248478":"sandwich","ICN7694669350329500767":"roller coaster","ICN3837106180269385958":"river","ICN2763662642142502094":"rain","ICN4297430279321125085":"remote control","ICN2013902325750487197":"rollerskates","ICN7315791657767547935":"rainbow","ICN5772106679152597150":"radio","ICN1029972330210538750":"rake","ICN7966354684636949909":"potato","ICN3943043191005681913":"raccoon","ICN7873467713613606993":"purse","ICN8291577832310989474":"rabbit","ICN6706451938916357401":"postcard","ICN4491343578380693787":"power outlet","ICN5404801687335804034":"pliers","ICN8712189826974074197":"pond","ICN7199626426099169307":"popsicle","ICN8534446663426741078":"pool","ICN870676668187547376":"police car","ICN961726880370407803":"picture frame","ICN4831707853789837328":"pig","ICN5400659343207548949":"penguin","ICN665711520926314991":"pillow","ICN4687536868249889442":"pizza","ICN1993443822239105522":"pineapple","ICN1469293541202730748":"peas","ICN6900315454441946554":"hand","ICN7166651103419636474":"pickup truck","ICN1777311115418005512":"pencil","ICN488146721591670254":"piano","ICN2823497967098659639":"hammer","ICN593665472616369405":"lion","ICN87541970534080374":"ocean","ICN8345523478326464213":"foot","ICN1176014928905301627":"frog","ICN1224834447625594981":"hamburger","ICN7863983519273087949":"flashlight","ICN789106146430296555":"frying pan","ICN970696053168199669":"flying saucer","ICN9016527607083255844":"fork","ICN5648061924536889148":"floor lamp","ICN1654966278417765905":"firetruck","ICN3334414779717774274":"fireplace","ICN2310942261704561300":"flower","ICN6559402343780242226":"flamingo","ICN365572723805758749":"flip flops","ICN541235794821737945":"finger","ICN5665047913743401367":"fire hydrant","ICN5907578695319694738":"fence","ICN5222392630136446399":"eyeglasses","ICN7838882790374446777":"face","ICN8119258481067788987":"feather","ICN5544596661818279812":"eye","ICN6741845096162464434":"fan","ICN7633220359931638849":"elbow","ICN8783758674327590596":"ear","ICN6577279094656896832":"eraser","ICN5131340094776940589":"envelope","ICN3211802584007572001":"elephant","ICN5283229932636987002":"dumbbell","ICN3989486873290781067":"drill","ICN3210922393933032268":"drums","ICN6081168474291969536":"duck","ICN3670016203837307507":"dog","ICN5104926717383611009":"donut","ICN9122227234894101387":"dragon","ICN795728759007443690":"diving board","ICN9078269273639241531":"dresser","ICN6892550729109544157":"dolphin","ICN7599725479409942694":"door","ICN29505518175733761":"dishwasher","ICN7492638613466707328":"cup","ICN4330318043724885828":"diamond","ICN8462784837877840106":"crab","ICN2202617557992240789":"cooler","ICN8865184300634983288":"crayon","ICN1173955767045580620":"crown","ICN6496022943348288075":"cruise ship","ICN5640299509178977333":"computer","ICN7639419142216283868":"cookie","ICN459094493390341040":"cow","ICN2277672216748057394":"couch","ICN3046076614894262404":"coffee cup","ICN3483482415359539358":"clarinet","ICN9157295908290649002":"cloud","ICN2857327783822537463":"clock","ICN4015743874484707598":"compass","ICN6285906528689076027":"chair","ICN412849766696088460":"chandelier","ICN2573835131869224813":"cello","ICN3710774217155121376":"church","ICN2546597259665672624":"circle","ICN3844077079642966766":"cell phone","ICN3636117496077805816":"cat","ICN4159682054375095792":"ceiling fan","ICN6592473499833310886":"carrot","ICN7941851587715598553":"castle","ICN3952447077561154320":"car","ICN2779228481793897547":"candle","ICN7642248042656730087":"cannon","ICN1949399950608754748":"canoe","ICN2782836046824136665":"calendar","ICN7106914244492273008":"camouflage","ICN2111215857318306151":"camera","ICN3732457117487546968":"campfire","ICN5981391358788101385":"camel","ICN5354404731744254726":"butterfly","ICN6479694244519335818":"cactus","ICN4559965658089380800":"calculator","ICN6567996186680688816":"cake","ICN4815843793703402420":"bus","ICN7492924959829371622":"bulldozer","ICN1884585140489710018":"bush","ICN5151475835421192732":"broccoli","ICN6821321150187273279":"bucket","ICN869995962367003226":"broom","ICN3266939114125304985":"bridge","ICN6538635271680560113":"bread","ICN8780320848657310737":"boomerang","ICN5722697448303225970":"brain","ICN4091203155261746008":"birthday cake","ICN8851439323505814553":"bracelet","ICN8773979495282076332":"bowtie","ICN2150589122064156224":"bottlecap","ICN1201163894974846314":"book","ICN1230059855340954307":"bird","ICN1069641101339467247":"bench","ICN4916365929506755504":"bicycle","ICN4003319201389215820":"blackberry","ICN2206554737007244589":"blueberry","ICN2381986490792146227":"binoculars","ICN5936517737337842079":"belt","ICN421164662809456471":"passport","ICN5302759577744331795":"giraffe","ICN2606060108096512301":"apple","ICN6166795692913542820":"parrot","ICN8557512830026790349":"peanut","ICN4060697526362755463":"grapes","ICN451440502200807680":"garden","ICN2293018997254167922":"pear","ICN3761821260900058540":"parachute","ICN4055995756978691277":"golf club","ICN95545737252674830":"goatee","ICN4470316635287300365":"garden hose","ICN6194262040238022552":"grass","ICN3194060794091678862":"guitar","ICN2246759059904772169":"beard","ICN889806603521396791":"bathtub","ICN3564901500710886056":"bed","ICN2184613465518858855":"beach","ICN8128408364893689311":"bee","ICN4733546399453999823":"bandage","ICN8277183135300943355":"barn","ICN2685193188060662255":"bear","ICN2721561094649376919":"bat","ICN3654851641929348735":"basket","ICN4276273526749367870":"paintbrush","ICN3424648382449503444":"basketball","ICN3000205171788105654":"baseball bat","ICN1519043493654911350":"microphone","ICN7622371794969162279":"palm tree","ICN3616065804072647123":"nail","ICN5945964014660792238":"pants","ICN4498863126064467514":"paint can","ICN7498387876071463157":"paper clip","ICN878638031429235684":"axe","ICN9131018775790074153":"moustache","ICN4592689632576003979":"motorbike","ICN3066020763920783141":"mushroom","ICN5667455864585941071":"monkey","ICN3031333903200352976":"necklace","ICN8371945644789876685":"mouse","ICN2294482561971036529":"mouth","ICN231671706681797231":"microwave","ICN1245475861470247296":"mosquito","ICN5310593900320026528":"moon","ICN8877208624758716143":"mug","ICN5010894140984664568":"mountain","ICN8795231723213161313":"horse","ICN7621698895098531156":"mermaid","ICN1159493598464181189":"The Mona Lisa","ICN1858563198575722760":"leg","ICN4411811655367668799":"marker","ICN691701053550137063":"map","ICN6645544467131802794":"matches","ICN5618698217726949499":"megaphone","ICN3955467755311756312":"The Great Wall","ICN359695619766935786":"light bulb","ICN4632607479283538895":"lobster","ICN126453137062133392":"line","ICN1744487595634142666":"lollipop","ICN8506717020814663432":"lipstick","ICN1024552193526878778":"lantern","ICN3410284373768344472":"The Eiffel Tower","ICN8167672908278233389":"backpack","ICN6140925958607542630":"leaf","ICN6350238331318711433":"ladder","ICN6677694783964186231":"knee","ICN7176249269771350040":"keyboard","ICN1736573881818031050":"kangaroo","ICN3653865584304867159":"key","ICN3614322119727563345":"hockey stick","ICN5278271215884619890":"hockey puck","ICN1535781123716586136":"helicopter","ICN8626938984853781425":"hexagon","ICN6466554540928171892":"helmet","ICN900930675574429298":"hospital","ICN6843459730544245545":"hot dog","ICN8942047968460575590":"hurricane","ICN247956084500171066":"hot air balloon","ICN8302355220242005579":"jail","ICN3598550839311936280":"hot tub","ICN4587410633847355316":"jacket","ICN9057315286402627217":"house","ICN6067836796407030170":"hourglass","ICN8987553702274754892":"house plant","ICN929877119277073455":"ice cream","ICN1398102684187441845":"banana","ICN3919728099480683988":"harp","ICN1827376560857664268":"hat","ICN8013086820680845825":"hedgehog","ICN3133244613942561119":"headphones","ICN86314099004122807":"asparagus","ICN4867358876809679769":"ant","ICN1528196145339804997":"anvil","ICN926224881525605738":"arm","ICN5421922406993645549":"animal migration","ICN4899575051798712764":"airplane","ICN2085817727248593182":"ambulance","ICN1083025955129730021":"alarm clock","ICN2669568314475381086":"angel"}

async function main() {
  console.log('key_id,word');
  const models = Object.keys(modelToName);
  const list = fs.readdirSync('./images');
  for (let i = 0; i < list.length; i++) {
    const filename = list[i];
    const file = fs.readFileSync(`./images/${filename}`);
    const basename = filename.replace('.jpg', '');
    let results = await Promise.all(models.map(aModel => {
      const client = new automl.PredictionServiceClient();
      return client.predict({
        name: client.modelPath('coms-w4995', 'us-central1', aModel),
        payload: {image: {imageBytes: file}},
      })
      .then(res => {
        if (!res || !res[0] || !res[0].payload || !res[0].payload[0]) {
          return {model: aModel, prediction: '0', score: 100.0};
        }
        const payload = res[0].payload[0];
        return {model: aModel, prediction: payload.displayName, score: payload.classification.score};
      })
      .catch(err => {
        console.error(err);
        return {model: aModel, prediction: '0', score: 100.0};
      });
    }));

    results = results
      .sort((a, b) => {
        if (a.prediction !== '1') {
          return b.prediction === '1' ? -1 : 0;
        }
        if (b.prediction !== '1') {
          return 1;
        }
        return a.score - b.score > 0 ? 1 : -1;
      })
      .reverse();

    console.log(
      basename + ',' +
      [0, 1, 2].map(idx => modelToName[results[idx].model].replace(/\s/g, '_')).join(' '));
    //console.log(results[0], results[1], results[2])

    await new Promise(resolve => {
      setTimeout(resolve, 30000);
    });
  }
}

if (require.main === module) {
  main();
}
