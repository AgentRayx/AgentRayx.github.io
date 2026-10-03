export const BLOG_REPO='AgentRayx/AgentRayx.github.io';
export async function verifyOwner(api,credential){
 const user=await api('/user',{},credential);
 if(user.login?.toLowerCase()!=='agentrayx')throw Error('Este escritorio está reservado para AgentRayx.');
 const repo=await api('/repos/'+BLOG_REPO,{},credential);
 if(!repo.permissions?.push)throw Error('Tu cuenta no tiene acceso de escritura a este repositorio.');
 return user.login;
}
