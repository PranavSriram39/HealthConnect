import React from "react";


const teamMembers = [
  {
    name: "Sriram Pranav",
    email: "23r01a05c1@cmrithyderabad.edu.in",
    imgSrc: "https://static.vecteezy.com/system/resources/thumbnails/023/641/623/small_2x/avatar-of-a-cute-little-boy-isolated-illustration-in-cartoon-style-vector.jpg" 
  },
  {
    name: "Abhishek",
    email: "23r01a05c0@cmrithyderabad.edu.in",
    imgSrc: "https://static.vecteezy.com/system/resources/thumbnails/023/641/623/small_2x/avatar-of-a-cute-little-boy-isolated-illustration-in-cartoon-style-vector.jpg" 
  },
  {
    name: "Abhiram",
    email: "23r01a0598@cmrithyderabad.edu.in",
    imgSrc: "https://static.vecteezy.com/system/resources/thumbnails/023/641/623/small_2x/avatar-of-a-cute-little-boy-isolated-illustration-in-cartoon-style-vector.jpg" 
  },
  {
    name: "Gowthum",
    email: "23r01a0599@cmrithyderabad.edu.in",
    imgSrc: "https://static.vecteezy.com/system/resources/thumbnails/023/641/623/small_2x/avatar-of-a-cute-little-boy-isolated-illustration-in-cartoon-style-vector.jpg" 
  }
];

function AboutUs() {
  return (
    <div className="mx-8">
      <section className="section-white mt-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">The Team Behind HealthConnect</h2>
          </div>

          <div className="flex flex-wrap -mx-2">
            {teamMembers.map((member, index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
                <div className={`card bg-gray-100 p-4 rounded-md transition duration-300 transform hover:scale-105 ${index === 0 || index === teamMembers.length - 1 ? 'h-auto' : ''}`}>
                  <div className="card-img">
                    <img
                      src={member.imgSrc}
                      alt={member.name}
                      className="mx-auto mb-2 object-cover rounded-md"
                      style={{ width: '100%', height: '200px', maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-lg font-semibold mb-2">{member.name}</h5>
                    <p className="card-text">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${member.email}`} className="text-blue-500 hover:underline">
                        {member.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
