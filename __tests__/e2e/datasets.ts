export const createString = (length: number) => {
    let s = "";
    for (let x = 1; x <= length; x++) {
    s += x % 10;
    }
    return s;
};

export const blog1 /*: BlogDbType*/ = {
    id: new Date().toISOString() + Math.random(),
    name: "n1",
    description: "d1",
    websiteUrl: "http://some.com",
    createdAt: new Date().toISOString(),
    isMembership: false,
  } as const; // dataset нельзя изменять
  // blog1.name = 'n2' // error!!!


export const post1 /*: PostDbType*/ = {
    id: new Date().toISOString() + Math.random(),
    title: "t1",
    content: "c1",
    shortDescription: "s1",
    blogId: blog1.id,
    blogName: "n1",
    createdAt: new Date().toISOString(),
  } as const; // dataset нельзя изменять

export const user1 = {
    id: new Date().toISOString() + Math.random(),
    login:"login",
    email: "example@example.com",
    createdAt: new Date().toISOString(),
}