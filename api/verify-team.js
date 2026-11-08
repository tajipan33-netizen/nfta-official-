const TEAM_ENV = {"셀틱트넘FC":"TEAM_CODE_CELTOTTENAM","FC BARCELONA":"TEAM_CODE_BARCELONA","노팅엄 실험실":"TEAM_CODE_NOTTINGHAM","마레스카나치오날레":"TEAM_CODE_MARESCA","알 빌라 AL VILLA":"TEAM_CODE_ALVILLA","알네르바체":"TEAM_CODE_ALNERBAHCE","ASK 로마사라이":"TEAM_CODE_ASKROMA","서울풀FC":"TEAM_CODE_SEOULPOOL","코모쿠젠":"TEAM_CODE_COMOKUZEN","해머스":"TEAM_CODE_HAMMERS","헌라페":"TEAM_CODE_HUNLAFE","QUEENS BLACK ROVERS":"TEAM_CODE_QBR","SKY CITY":"TEAM_CODE_SKYCITY","Royal York Madrid":"TEAM_CODE_ROYALYORK","MSG":"TEAM_CODE_MSG","Les Bleus":"TEAM_CODE_LESBLEUS","FC Der Klassiker":"TEAM_CODE_DERKLASSIKER","본덜랜드":"TEAM_CODE_BONDEOL","NAPLESEA":"TEAM_CODE_NAPLESEA","Atletico Milan":"TEAM_CODE_ATLETICOMILAN","아스날FC":"TEAM_CODE_ARSENAL"};
export default function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'});}
  const {team,code}=req.body||{};
  if(typeof team!=='string'||typeof code!=='string'||!TEAM_ENV[team]) return res.status(400).json({ok:false,error:'구단 또는 코드 형식이 올바르지 않습니다.'});
  const expected=process.env[TEAM_ENV[team]];
  if(!expected) return res.status(503).json({ok:false,error:'구단 코드가 서버에 아직 설정되지 않았습니다. 관리자에게 문의하세요.'});
  if(code.length>100||code!==expected) return res.status(401).json({ok:false,error:'구단 코드가 올바르지 않습니다.'});
  return res.status(200).json({ok:true,team});
}
