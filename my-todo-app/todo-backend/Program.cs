// =============================================================================
// ไฟล์ Program.cs — จุดเริ่มต้นของ Web API (ASP.NET Core Minimal Hosting)
// What: ลงทะเบียนบริการ (DI), กำหนดการยืนยันตัวตน JWT, CORS, EF Core, Swagger
// Why: รวมการตั้งค่าระบบไว้ที่เดียว เพื่อให้ Controller และ DbContext ทำงานภายใต้
//      นโยบายความปลอดภัยเดียวกัน และให้ฝั่ง Frontend เรียก API ข้ามโดเมนได้ (CORS)
// =============================================================================
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TodoBackend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// =========================================================
// 🌟 1. การตั้งค่า CORS (Cross-Origin Resource Sharing)
// =========================================================
// อนุญาตให้ Frontend (Web) ที่รันคนละ Port/Domain สามารถยิง API เข้ามาได้
// AllowAnyOrigin = รับจากทุก IP/Domain, AllowAnyMethod = รับทุก Http Method (GET, POST, etc.)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Entity Framework + MySQL: ใช้ connection string จาก appsettings (ไม่ฝังรหัสในโค้ด)
builder.Services.AddDbContext<TodoDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("TodoDb");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

// JWT: ต้องมีคีย์ลับใน configuration — ใช้ลงลายมือชื่อและตรวจสอบ token
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("Missing configuration: Jwt:Key");
}

// การยืนยันตัวตนแบบ Bearer: คำขอที่ส่ง Authorization: Bearer <token> จะถูกตรวจลายเซ็นและอายุ token
// =========================================================
// 🌟 2. การตั้งค่า JWT Authentication
// =========================================================
// ตั้งค่าระบบรักษาความปลอดภัยให้ตรวจสอบความถูกต้องของ Token ก่อนให้เข้าใช้งาน API
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // เปิดการตรวจสอบผู้สร้าง (Issuer), ผู้รับ (Audience), เวลาหมดอายุ และลายเซ็น (Signature)
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            
            // อ่านค่าจาก appsettings.json ซึ่งกำหนดไว้คือ ToDo และ public
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            // ไม่เผื่อเวลา skew มากเกินไป เพื่อความเข้มงวดต่อเวลาหมดอายุของ token
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Swagger: ประกาศว่า API รองรับ JWT ผ่าน header Authorization — ใช้ทดสอบ endpoint ที่ต้องล็อกอินใน Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "ระบุค่าเป็น: token ที่ได้จาก POST /api/tokens"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// เปิด Swagger เฉพาะสภาพพัฒนา เพื่อไม่เปิดเผยเอกสาร API ในโปรดักชันโดยไม่ตั้งใจ
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAll");

// ลำดับสำคัญ: Authentication ก่อน Authorization — ให้ระบบรู้ Claims ก่อนตรวจ [Authorize]
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
