export default abstract class BaseSeeder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract seed(...args: any): unknown;
}
