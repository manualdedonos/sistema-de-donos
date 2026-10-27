// Rotoscopia de PESSOA quadro a quadro (Vision do macOS, sem rede) → PNG com alfa.
// uso: swift tools/roto.swift <dir_entrada_jpg> <dir_saida_png> [feather_px=1.5]
// Entrada: quadros gerados por ffmpeg (ex.: fps=12). Saída: mesmo nome, .png RGBA (fundo transparente).
// Usa VNGeneratePersonSegmentationRequest(.accurate): pega pessoa inteira (cabelo, mãos), ignora mesa/caneca.
import Vision
import CoreImage
import AppKit

let a = CommandLine.arguments
let inDir = URL(fileURLWithPath: a[1]), outDir = URL(fileURLWithPath: a[2])
let feather = a.count > 3 ? Double(a[3])! : 1.5
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
let files = try! FileManager.default.contentsOfDirectory(atPath: inDir.path)
  .filter { $0.hasSuffix(".jpg") && !$0.hasPrefix("._") }.sorted()
let ctx = CIContext()
let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
var n = 0
for f in files {
  let out = outDir.appendingPathComponent((f as NSString).deletingPathExtension + ".png")
  if FileManager.default.fileExists(atPath: out.path) { continue }
  autoreleasepool {
    let img = CIImage(contentsOf: inDir.appendingPathComponent(f))!
    let h = VNImageRequestHandler(ciImage: img)
    try! h.perform([req])
    guard let buf = req.results?.first?.pixelBuffer else { return }
    var mask = CIImage(cvPixelBuffer: buf)
    mask = mask.transformed(by: CGAffineTransform(scaleX: img.extent.width / mask.extent.width, y: img.extent.height / mask.extent.height))
    if feather > 0 { mask = mask.clampedToExtent().applyingGaussianBlur(sigma: feather).cropped(to: img.extent) }
    let clear = CIImage(color: .clear).cropped(to: img.extent)
    let res = img.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: clear, kCIInputMaskImageKey: mask])
    try! ctx.writePNGRepresentation(of: res, to: out, format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
    n += 1
    if n % 24 == 0 { print("roto \(n)/\(files.count)") }
  }
}
print("ok \(n) quadros")
